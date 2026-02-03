import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "@markarapor/database";
import { TRPCError } from "@trpc/server";

export const workspaceRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const workspaces = await prisma.workspaceMember.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        workspace: {
          include: {
            _count: {
              select: {
                brands: true,
                members: true,
              },
            },
          },
        },
      },
    });
    return workspaces.map((m) => ({
      ...m.workspace,
      role: m.role,
    }));
  }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: input.id,
          userId: ctx.session.user.id,
        },
        include: {
          workspace: {
            include: {
              brands: true,
              members: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!member) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return member.workspace;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Generate slug from name if not provided
      const baseSlug = input.slug || input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 50);

      // Ensure unique slug by appending random suffix if needed
      let slug = baseSlug;
      let existing = await prisma.workspace.findUnique({
        where: { slug },
      });

      if (existing) {
        // Add random suffix
        const suffix = Math.random().toString(36).slice(2, 8);
        slug = `${baseSlug.slice(0, 42)}-${suffix}`;
        existing = await prisma.workspace.findUnique({
          where: { slug },
        });

        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Bu slug zaten kullanılıyor",
          });
        }
      }

      const workspace = await prisma.workspace.create({
        data: {
          name: input.name,
          slug,
          members: {
            create: {
              userId: ctx.session.user.id,
              role: "OWNER",
            },
          },
        },
      });

      return workspace;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: input.id,
          userId: ctx.session.user.id,
          role: { in: ["OWNER", "ADMIN"] },
        },
      });

      if (!member) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const workspace = await prisma.workspace.update({
        where: { id: input.id },
        data: { name: input.name },
      });

      return workspace;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: input.id,
          userId: ctx.session.user.id,
          role: "OWNER",
        },
      });

      if (!member) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await prisma.workspace.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
