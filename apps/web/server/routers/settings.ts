import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "@markarapor/database";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";

// Simple encryption for API keys (in production, use a proper secrets manager)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "markarapor-default-key-32ch";
const IV_LENGTH = 16;

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(text: string): string {
  const parts = text.split(":");
  const iv = Buffer.from(parts[0], "hex");
  const encryptedText = parts[1];
  const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Mask API key for display (show only last 4 characters)
function maskApiKey(key: string): string {
  if (key.length <= 8) return "••••••••";
  return "••••••••" + key.slice(-4);
}

export const settingsRouter = createTRPCRouter({
  // Get workspace settings (without exposing full API keys)
  get: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Check admin access
      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: input.workspaceId,
          userId: ctx.session.user.id,
          role: { in: ["OWNER", "ADMIN"] },
        },
      });

      if (!member) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const workspace = await prisma.workspace.findUnique({
        where: { id: input.workspaceId },
        select: {
          id: true,
          name: true,
          settings: true,
        },
      });

      if (!workspace) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Parse settings and mask sensitive values
      const settings = (workspace.settings as Record<string, any>) || {};

      return {
        workspaceId: workspace.id,
        workspaceName: workspace.name,
        apiKeys: {
          anthropicConfigured: !!settings.anthropicApiKey,
          anthropicMasked: settings.anthropicApiKey
            ? maskApiKey(decrypt(settings.anthropicApiKey))
            : null,
          openaiConfigured: !!settings.openaiApiKey,
          openaiMasked: settings.openaiApiKey
            ? maskApiKey(decrypt(settings.openaiApiKey))
            : null,
          googleAdsDevTokenConfigured: !!settings.googleAdsDevToken,
          googleAdsDevTokenMasked: settings.googleAdsDevToken
            ? maskApiKey(decrypt(settings.googleAdsDevToken))
            : null,
        },
        features: {
          aiInsightsEnabled: settings.aiInsightsEnabled ?? true,
          autoReportsEnabled: settings.autoReportsEnabled ?? false,
          emailNotificationsEnabled: settings.emailNotificationsEnabled ?? true,
        },
      };
    }),

  // Update API keys
  updateApiKeys: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        anthropicApiKey: z.string().optional(),
        openaiApiKey: z.string().optional(),
        googleAdsDevToken: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check owner access for API key changes
      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: input.workspaceId,
          userId: ctx.session.user.id,
          role: "OWNER",
        },
      });

      if (!member) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only workspace owners can update API keys",
        });
      }

      const workspace = await prisma.workspace.findUnique({
        where: { id: input.workspaceId },
        select: { settings: true },
      });

      if (!workspace) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const currentSettings = (workspace.settings as Record<string, any>) || {};
      const newSettings = { ...currentSettings };

      // Update only provided keys (encrypt them)
      if (input.anthropicApiKey !== undefined) {
        if (input.anthropicApiKey) {
          newSettings.anthropicApiKey = encrypt(input.anthropicApiKey);
        } else {
          delete newSettings.anthropicApiKey;
        }
      }

      if (input.openaiApiKey !== undefined) {
        if (input.openaiApiKey) {
          newSettings.openaiApiKey = encrypt(input.openaiApiKey);
        } else {
          delete newSettings.openaiApiKey;
        }
      }

      if (input.googleAdsDevToken !== undefined) {
        if (input.googleAdsDevToken) {
          newSettings.googleAdsDevToken = encrypt(input.googleAdsDevToken);
        } else {
          delete newSettings.googleAdsDevToken;
        }
      }

      await prisma.workspace.update({
        where: { id: input.workspaceId },
        data: { settings: newSettings },
      });

      return { success: true };
    }),

  // Update feature flags
  updateFeatures: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        aiInsightsEnabled: z.boolean().optional(),
        autoReportsEnabled: z.boolean().optional(),
        emailNotificationsEnabled: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check admin access
      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: input.workspaceId,
          userId: ctx.session.user.id,
          role: { in: ["OWNER", "ADMIN"] },
        },
      });

      if (!member) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const workspace = await prisma.workspace.findUnique({
        where: { id: input.workspaceId },
        select: { settings: true },
      });

      if (!workspace) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const currentSettings = (workspace.settings as Record<string, any>) || {};
      const { workspaceId, ...features } = input;

      const newSettings = {
        ...currentSettings,
        ...Object.fromEntries(
          Object.entries(features).filter(([_, v]) => v !== undefined)
        ),
      };

      await prisma.workspace.update({
        where: { id: input.workspaceId },
        data: { settings: newSettings },
      });

      return { success: true };
    }),

  // Get decrypted API key (for internal use in workflow execution)
  // This should only be called server-side, not exposed to client
  getDecryptedKey: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        keyType: z.enum(["anthropic", "openai", "googleAdsDevToken"]),
      })
    )
    .query(async ({ ctx, input }) => {
      // Check workspace access
      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: input.workspaceId,
          userId: ctx.session.user.id,
        },
      });

      if (!member) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const workspace = await prisma.workspace.findUnique({
        where: { id: input.workspaceId },
        select: { settings: true },
      });

      if (!workspace) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const settings = (workspace.settings as Record<string, any>) || {};

      const keyMap: Record<string, string | undefined> = {
        anthropic: settings.anthropicApiKey,
        openai: settings.openaiApiKey,
        googleAdsDevToken: settings.googleAdsDevToken,
      };

      const encryptedKey = keyMap[input.keyType];

      if (!encryptedKey) {
        return { key: null };
      }

      try {
        const decryptedKey = decrypt(encryptedKey);
        return { key: decryptedKey };
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to decrypt API key",
        });
      }
    }),
});
