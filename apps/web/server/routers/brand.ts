import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "@markarapor/database";
import { TRPCError } from "@trpc/server";

export const brandRouter = createTRPCRouter({
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

      const brands = await prisma.brand.findMany({
        where: { workspaceId: input.workspaceId },
        include: {
          _count: {
            select: {
              workflows: true,
              connections: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return brands;
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const brand = await prisma.brand.findUnique({
        where: { id: input.id },
        include: {
          workspace: true,
          connections: true,
          workflows: {
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
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

      return brand;
    }),

  create: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        name: z.string().min(1).max(100),
        logo: z.string().url().optional(),
        website: z.string().url().optional(),
        industry: z.string().optional(),
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

      // Generate slug from name
      const slug = input.name
        .toLowerCase()
        .replace(/[^a-z0-9\u00e0-\u017f]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 50);

      const brand = await prisma.brand.create({
        data: {
          name: input.name,
          slug: `${slug}-${Date.now().toString(36)}`,
          logo: input.logo,
          website: input.website,
          industry: input.industry,
          workspaceId: input.workspaceId,
        },
      });

      return brand;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100).optional(),
        logo: z.string().url().optional().nullable(),
        website: z.string().url().optional().nullable(),
        industry: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const brand = await prisma.brand.findUnique({
        where: { id: input.id },
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

      const { id, ...data } = input;
      const updated = await prisma.brand.update({
        where: { id },
        data,
      });

      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const brand = await prisma.brand.findUnique({
        where: { id: input.id },
      });

      if (!brand) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check access
      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: brand.workspaceId,
          userId: ctx.session.user.id,
          role: { in: ["OWNER", "ADMIN"] },
        },
      });

      if (!member) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await prisma.brand.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
