import { createTRPCRouter } from "../trpc";
import { userRouter } from "./user";
import { workspaceRouter } from "./workspace";
import { brandRouter } from "./brand";
import { workflowRouter } from "./workflow";
import { connectionRouter } from "./connection";
import { settingsRouter } from "./settings";

export const appRouter = createTRPCRouter({
  user: userRouter,
  workspace: workspaceRouter,
  brand: brandRouter,
  workflow: workflowRouter,
  connection: connectionRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
