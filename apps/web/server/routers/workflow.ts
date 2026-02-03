import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "@markarapor/database";
import { TRPCError } from "@trpc/server";
import { getTemplateConfig, calculateDateVariables } from "~/lib/workflow-templates";

export const workflowRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().optional(),
        brandId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Get user's workspaces
      const userWorkspaces = await prisma.workspaceMember.findMany({
        where: { userId: ctx.session.user.id },
        select: { workspaceId: true },
      });

      const workspaceIds = input.workspaceId
        ? [input.workspaceId]
        : userWorkspaces.map((w) => w.workspaceId);

      const workflows = await prisma.workflow.findMany({
        where: {
          brand: {
            workspaceId: { in: workspaceIds },
          },
          ...(input.brandId && { brandId: input.brandId }),
        },
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
          _count: {
            select: {
              runs: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      return workflows;
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findUnique({
        where: { id: input.id },
        include: {
          brand: {
            include: {
              workspace: true,
              connections: true,
            },
          },
          runs: {
            orderBy: { startedAt: "desc" },
            take: 10,
            select: {
              id: true,
              status: true,
              startedAt: true,
              completedAt: true,
              creditsUsed: true,
              error: true,
              nodeResults: true,
            },
          },
        },
      });

      if (!workflow) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check access
      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: workflow.brand.workspaceId,
          userId: ctx.session.user.id,
        },
      });

      if (!member) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return workflow;
    }),

  create: protectedProcedure
    .input(
      z.object({
        brandId: z.string(),
        name: z.string().min(1).max(100),
        description: z.string().optional(),
        templateId: z.string().optional(),
        config: z.any().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const brand = await prisma.brand.findUnique({
        where: { id: input.brandId },
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

      // Get template configuration if templateId is provided
      let nodes = input.config?.nodes || [];
      let edges = input.config?.edges || [];
      let variables = input.config?.variables || {};

      if (input.templateId) {
        const templateConfig = getTemplateConfig(input.templateId);
        if (templateConfig) {
          nodes = templateConfig.nodes;
          edges = templateConfig.edges;
          // Merge template variables with calculated date variables
          variables = {
            ...templateConfig.variables,
            ...calculateDateVariables(),
          };
        }
      }

      const workflow = await prisma.workflow.create({
        data: {
          name: input.name,
          description: input.description,
          templateId: input.templateId,
          nodes: JSON.parse(JSON.stringify(nodes)),
          edges: JSON.parse(JSON.stringify(edges)),
          variables: JSON.parse(JSON.stringify(variables)),
          brandId: input.brandId,
          workspaceId: brand.workspaceId,
          createdById: ctx.session.user.id,
        },
      });

      return workflow;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100).optional(),
        description: z.string().optional().nullable(),
        nodes: z.any().optional(),
        edges: z.any().optional(),
        variables: z.any().optional(),
        schedule: z.any().optional().nullable(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findUnique({
        where: { id: input.id },
        include: { brand: true },
      });

      if (!workflow) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check access
      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: workflow.brand.workspaceId,
          userId: ctx.session.user.id,
        },
      });

      if (!member) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const { id, ...data } = input;
      const updated = await prisma.workflow.update({
        where: { id },
        data,
      });

      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findUnique({
        where: { id: input.id },
        include: { brand: true },
      });

      if (!workflow) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check access
      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: workflow.brand.workspaceId,
          userId: ctx.session.user.id,
          role: { in: ["OWNER", "ADMIN"] },
        },
      });

      if (!member) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await prisma.workflow.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  run: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findUnique({
        where: { id: input.id },
        include: { brand: { include: { workspace: true } } },
      });

      if (!workflow) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check access
      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: workflow.brand.workspaceId,
          userId: ctx.session.user.id,
        },
      });

      if (!member) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Check credits
      if (workflow.brand.workspace.credits < 5) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Yetersiz kredi. Lütfen planınızı yükseltin.",
        });
      }

      // Create a new run
      const run = await prisma.workflowRun.create({
        data: {
          workflowId: workflow.id,
          status: "PENDING",
          triggeredBy: "MANUAL",
        },
      });

      // Execute workflow asynchronously (fire and forget)
      // In production, this should be queued (e.g., with BullMQ or similar)
      import("~/lib/workflow-executor").then(({ executeWorkflow }) => {
        executeWorkflow(workflow.id, run.id, ctx.session.user.id).catch(
          (error) => {
            console.error("Workflow execution error:", error);
          }
        );
      });

      return run;
    }),

  // Get run details
  getRun: protectedProcedure
    .input(z.object({ runId: z.string() }))
    .query(async ({ ctx, input }) => {
      const run = await prisma.workflowRun.findUnique({
        where: { id: input.runId },
        include: {
          workflow: {
            include: { brand: true },
          },
        },
      });

      if (!run) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check access
      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: run.workflow.brand.workspaceId,
          userId: ctx.session.user.id,
        },
      });

      if (!member) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return run;
    }),

  // List runs for a workflow
  listRuns: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findUnique({
        where: { id: input.workflowId },
        include: { brand: true },
      });

      if (!workflow) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check access
      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: workflow.brand.workspaceId,
          userId: ctx.session.user.id,
        },
      });

      if (!member) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const runs = await prisma.workflowRun.findMany({
        where: { workflowId: input.workflowId },
        orderBy: { startedAt: "desc" },
        take: input.limit,
      });

      return runs;
    }),
});
