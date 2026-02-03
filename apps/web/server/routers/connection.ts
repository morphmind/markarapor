import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "@markarapor/database";
import { TRPCError } from "@trpc/server";

export const connectionRouter = createTRPCRouter({
  // List all connections in a workspace
  list: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
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

      const connections = await prisma.connection.findMany({
        where: { workspaceId: input.workspaceId },
        include: {
          brandConnections: {
            include: {
              brand: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Transform to include brand info at top level for easier access
      return connections.map((conn) => ({
        ...conn,
        brands: conn.brandConnections.map((bc) => bc.brand),
      }));
    }),

  // List connections by brand
  listByBrand: protectedProcedure
    .input(z.object({ brandId: z.string() }))
    .query(async ({ ctx, input }) => {
      const brand = await prisma.brand.findUnique({
        where: { id: input.brandId },
        select: { workspaceId: true },
      });

      if (!brand) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check access
      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: brand.workspaceId,
          userId: ctx.session.user.id,
        },
      });

      if (!member) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const brandConnections = await prisma.brandConnection.findMany({
        where: { brandId: input.brandId },
        include: {
          connection: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return brandConnections.map((bc) => ({
        ...bc.connection,
        propertyId: bc.propertyId,
        propertyName: bc.propertyName,
        isDefault: bc.isDefault,
      }));
    }),

  // Get single connection
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const connection = await prisma.connection.findUnique({
        where: { id: input.id },
        include: {
          workspace: true,
          brandConnections: {
            include: {
              brand: true,
            },
          },
        },
      });

      if (!connection) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check access
      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: connection.workspaceId,
          userId: ctx.session.user.id,
        },
      });

      if (!member) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return connection;
    }),

  // Create connection
  create: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        brandId: z.string().optional(),
        provider: z.enum([
          "GOOGLE_ADS",
          "GOOGLE_ANALYTICS",
          "GOOGLE_SEARCH_CONSOLE",
          "GOOGLE_SLIDES",
          "GOOGLE_SHEETS",
          "GOOGLE_DRIVE",
        ]),
        name: z.string().min(1).max(100),
        accessToken: z.string().optional(),
        refreshToken: z.string().optional(),
        accountId: z.string().optional(),
        accountName: z.string().optional(),
        propertyId: z.string().optional(),
        propertyName: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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

      // Create connection
      const connection = await prisma.connection.create({
        data: {
          name: input.name,
          provider: input.provider,
          accessToken: input.accessToken || "pending", // Will be set after OAuth
          refreshToken: input.refreshToken,
          accountId: input.accountId,
          accountName: input.accountName,
          status: input.accessToken ? "ACTIVE" : "EXPIRED", // Set to EXPIRED if no token yet
          workspaceId: input.workspaceId,
        },
      });

      // If brandId is provided, create BrandConnection
      if (input.brandId) {
        await prisma.brandConnection.create({
          data: {
            brandId: input.brandId,
            connectionId: connection.id,
            propertyId: input.propertyId,
            propertyName: input.propertyName,
            isDefault: true,
          },
        });
      }

      return connection;
    }),

  // Update connection
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100).optional(),
        accessToken: z.string().optional(),
        refreshToken: z.string().optional(),
        accountId: z.string().optional(),
        accountName: z.string().optional(),
        status: z.enum(["ACTIVE", "EXPIRED", "REVOKED", "ERROR"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const connection = await prisma.connection.findUnique({
        where: { id: input.id },
      });

      if (!connection) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check access
      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: connection.workspaceId,
          userId: ctx.session.user.id,
        },
      });

      if (!member) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const { id, ...data } = input;
      const updated = await prisma.connection.update({
        where: { id },
        data: {
          ...data,
          lastTestedAt: data.status === "ACTIVE" ? new Date() : undefined,
        },
      });

      return updated;
    }),

  // Delete connection
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const connection = await prisma.connection.findUnique({
        where: { id: input.id },
      });

      if (!connection) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check access - only admin/owner
      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: connection.workspaceId,
          userId: ctx.session.user.id,
          role: { in: ["OWNER", "ADMIN"] },
        },
      });

      if (!member) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Delete brand connections first, then the connection
      await prisma.brandConnection.deleteMany({
        where: { connectionId: input.id },
      });

      await prisma.connection.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // Test connection
  test: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const connection = await prisma.connection.findUnique({
        where: { id: input.id },
      });

      if (!connection) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check access
      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: connection.workspaceId,
          userId: ctx.session.user.id,
        },
      });

      if (!member) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // TODO: Implement actual connection testing based on provider
      // For now, just update status to ACTIVE
      const updated = await prisma.connection.update({
        where: { id: input.id },
        data: {
          status: "ACTIVE",
          lastTestedAt: new Date(),
        },
      });

      return { success: true, connection: updated };
    }),

  // Link connection to brand
  linkToBrand: protectedProcedure
    .input(
      z.object({
        connectionId: z.string(),
        brandId: z.string(),
        propertyId: z.string().optional(),
        propertyName: z.string().optional(),
        isDefault: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const connection = await prisma.connection.findUnique({
        where: { id: input.connectionId },
      });

      if (!connection) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check access
      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: connection.workspaceId,
          userId: ctx.session.user.id,
        },
      });

      if (!member) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Check brand belongs to same workspace
      const brand = await prisma.brand.findFirst({
        where: {
          id: input.brandId,
          workspaceId: connection.workspaceId,
        },
      });

      if (!brand) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Brand does not belong to this workspace",
        });
      }

      // Create brand connection
      const brandConnection = await prisma.brandConnection.create({
        data: {
          brandId: input.brandId,
          connectionId: input.connectionId,
          propertyId: input.propertyId,
          propertyName: input.propertyName,
          isDefault: input.isDefault ?? false,
        },
      });

      return brandConnection;
    }),
});
