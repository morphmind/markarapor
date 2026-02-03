import { prisma } from "@markarapor/database";
import { google } from "googleapis";
import { getValidAccessToken, getConnectionTokens } from "./google-oauth";
import { sendTemplatedEmail } from "./email";
import { rateLimiters, cache, cacheKeys } from "./redis";
import { calculateDateVariables } from "./workflow-templates";

// Local type definitions for workflow execution
interface WorkflowNode {
  id: string;
  type: string;
  data?: {
    label?: string;
    config?: Record<string, unknown>;
  };
}

interface WorkflowEdge {
  id?: string;
  source: string;
  target: string;
}

interface WorkflowDefinition {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

interface WorkflowContext {
  workflowId: string;
  workspaceId: string;
  brandId: string;
  variables: Record<string, unknown>;
  nodeResults: Record<string, Record<string, unknown>>;
}

interface WorkflowRunResult {
  success: boolean;
  runId: string;
  duration: number;
  creditsUsed: number;
  nodeResults?: Record<string, unknown>;
  error?: string;
}

interface DataSourceNodeConfig {
  connectionId?: string;
  source?: string;
  dateRange: { startDate: string; endDate: string };
  metrics?: string[];
  dimensions?: string[];
}

interface AIAnalysisNodeConfig {
  analysisType: "insights" | "summary" | "recommendations";
  prompt?: string;
  inputNodeIds?: string[];
}

interface TransformNodeConfig {
  operation: "merge" | "filter" | "aggregate" | "calculate";
  inputNodeIds?: string[];
  options?: Record<string, unknown>;
}

interface ExportNodeConfig {
  format: string;
  inputNodeIds?: string[];
  template?: string;
}

/**
 * Resolve template variables like {{lastMonthStart}} in node configs
 */
function resolveTemplateVariables(
  obj: unknown,
  variables: Record<string, unknown>
): unknown {
  if (typeof obj === "string") {
    return obj.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
      const value = variables[key];
      return value !== undefined ? String(value) : "";
    });
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => resolveTemplateVariables(item, variables));
  }
  if (typeof obj === "object" && obj !== null) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = resolveTemplateVariables(value, variables);
    }
    return result;
  }
  return obj;
}

/**
 * Resolve connectionId from brand's connections when only source (provider) is given
 */
async function resolveConnectionForBrand(
  brandId: string,
  provider: string
): Promise<string> {
  const brandConnection = await prisma.brandConnection.findFirst({
    where: {
      brandId,
      connection: {
        provider: provider as any,
        status: "ACTIVE",
      },
    },
    include: { connection: true },
  });

  if (!brandConnection) {
    throw new Error(
      `Bu marka için ${provider} bağlantısı bulunamadı. Lütfen önce bağlantı ekleyin.`
    );
  }

  return brandConnection.connectionId;
}

// Get decrypted API key from workspace settings
async function getWorkspaceApiKey(
  workspaceId: string,
  keyType: "anthropic" | "openai"
): Promise<string | null> {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { settings: true },
  });

  if (!workspace?.settings) return null;

  const settings = workspace.settings as Record<string, string>;
  const encryptedKey =
    keyType === "anthropic"
      ? settings.anthropicApiKey
      : settings.openaiApiKey;

  if (!encryptedKey) return null;

  // Decrypt the key (using the same method as settings router)
  const crypto = await import("crypto");
  const ENCRYPTION_KEY =
    process.env.ENCRYPTION_KEY || "markarapor-default-key-32ch";

  try {
    const parts = encryptedKey.split(":");
    const iv = Buffer.from(parts[0], "hex");
    const encryptedText = parts[1];
    const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch {
    return null;
  }
}

// Execute a single node
async function executeNode(
  node: WorkflowDefinition["nodes"][0],
  context: WorkflowContext,
  workspaceId: string
): Promise<Record<string, unknown>> {
  const nodeType = node.type;
  const rawConfig = node.data?.config || {};

  // Resolve template variables in config
  const config = resolveTemplateVariables(
    rawConfig,
    context.variables
  ) as Record<string, unknown>;

  switch (nodeType) {
    case "data-source": {
      const dsConfig = config as unknown as DataSourceNodeConfig;
      return await executeDataSourceNode(dsConfig, context);
    }

    case "ai-analysis": {
      const aiConfig = config as unknown as AIAnalysisNodeConfig;
      return await executeAIAnalysisNode(aiConfig, context, workspaceId);
    }

    case "transform": {
      const transformConfig = config as unknown as TransformNodeConfig;
      return executeTransformNode(transformConfig, context);
    }

    case "export": {
      const exportConfig = config as unknown as ExportNodeConfig;
      return executeExportNode(exportConfig, context);
    }

    default:
      return { skipped: true, reason: `Unknown node type: ${nodeType}` };
  }
}

// Create OAuth2 client with access token
function createAuthClient(accessToken: string, refreshToken?: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  return oauth2Client;
}

// Execute data source node
async function executeDataSourceNode(
  config: DataSourceNodeConfig,
  context: WorkflowContext
): Promise<Record<string, unknown>> {
  const { dateRange, metrics, dimensions } = config;
  let { connectionId } = config;

  // If no connectionId but source (provider) is given, resolve from brand connections
  if (!connectionId && config.source) {
    connectionId = await resolveConnectionForBrand(
      context.brandId,
      config.source
    );
  }

  if (!connectionId) {
    throw new Error("Bağlantı ID'si veya kaynak belirtilmelidir.");
  }

  // Get access token for the connection
  const accessToken = await getValidAccessToken(connectionId);

  // Get connection details
  const connection = await prisma.connection.findUnique({
    where: { id: connectionId },
  });

  if (!connection) {
    throw new Error("Connection not found");
  }

  // Check cache first
  const cacheKey = cacheKeys.googleAnalyticsData(
    connectionId,
    `${dateRange.startDate}-${dateRange.endDate}`
  );
  const cached = await cache.get<Record<string, unknown>>(cacheKey);
  if (cached) {
    return cached;
  }

  // Execute based on provider
  let result: Record<string, unknown>;

  switch (connection.provider) {
    case "GOOGLE_ANALYTICS": {
      const { GoogleAnalyticsClient } = await import("@markarapor/integrations");

      // Get property ID from brand connection
      const brandConnection = await prisma.brandConnection.findFirst({
        where: { connectionId },
      });

      if (!brandConnection?.propertyId) {
        throw new Error("GA4 Property ID not configured");
      }

      // Create OAuth2 client
      const authClient = createAuthClient(accessToken);
      const client = new GoogleAnalyticsClient(authClient as any, brandConnection.propertyId);

      const report = await client.runReport({
        propertyId: brandConnection.propertyId,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        metrics: metrics || ["sessions", "totalUsers", "screenPageViews"],
        dimensions: dimensions || ["date"],
      });

      result = { type: "analytics", data: report };
      break;
    }

    case "GOOGLE_ADS": {
      const { GoogleAdsClient } = await import("@markarapor/integrations");

      // Get tokens for refresh token
      const tokens = await getConnectionTokens(connectionId);

      // Get developer token from workspace settings
      const workspace = await prisma.workspace.findUnique({
        where: { id: context.workspaceId },
        select: { settings: true },
      });
      const settings = (workspace?.settings as Record<string, string>) || {};

      const client = new GoogleAdsClient({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        developerToken: settings.googleAdsDevToken || "",
        refreshToken: tokens.refreshToken || "",
        customerId: connection.accountId || "",
      });

      const data = await client.getAccountMetrics(
        dateRange.startDate,
        dateRange.endDate
      );

      result = { type: "ads", data };
      break;
    }

    case "GOOGLE_SEARCH_CONSOLE": {
      const { SearchConsoleClient } = await import("@markarapor/integrations");

      const brandConnection = await prisma.brandConnection.findFirst({
        where: { connectionId },
      });

      if (!brandConnection?.propertyId) {
        throw new Error("Search Console site URL not configured");
      }

      // Create OAuth2 client
      const authClient = createAuthClient(accessToken);
      const client = new SearchConsoleClient(authClient as any, brandConnection.propertyId);

      const data = await client.getSEOReport(
        dateRange.startDate,
        dateRange.endDate
      );

      result = { type: "search-console", data };
      break;
    }

    default:
      throw new Error(`Unsupported provider: ${connection.provider}`);
  }

  // Cache the result for 5 minutes
  await cache.set(cacheKey, result, 300);

  return result;
}

// Execute AI analysis node
async function executeAIAnalysisNode(
  config: AIAnalysisNodeConfig,
  context: WorkflowContext,
  workspaceId: string
): Promise<Record<string, unknown>> {
  const { analysisType, inputNodeIds } = config;

  // Get API key
  const apiKey = await getWorkspaceApiKey(workspaceId, "anthropic");
  if (!apiKey) {
    throw new Error("Anthropic API key not configured");
  }

  // Collect input data from previous nodes
  const inputData: Record<string, unknown>[] = [];
  for (const nodeId of inputNodeIds || []) {
    const nodeResult = context.nodeResults[nodeId];
    if (nodeResult) {
      inputData.push(nodeResult);
    }
  }

  // Use Claude for analysis
  const { ClaudeClient } = await import("@markarapor/ai");
  const claude = new ClaudeClient({ apiKey });

  let result: Record<string, unknown>;

  switch (analysisType) {
    case "insights": {
      const insights = await claude.generateInsights({
        reportType: "performance",
        data: inputData.reduce((acc, d, i) => ({ ...acc, [`source_${i}`]: d }), {}),
        language: "tr",
      });
      result = { ...insights };
      break;
    }

    case "summary": {
      // Organize input data by type for executive summary
      const summaryData: {
        adsData?: Record<string, unknown>;
        analyticsData?: Record<string, unknown>;
        searchConsoleData?: Record<string, unknown>;
      } = {};

      for (const data of inputData) {
        const dataType = (data as { type?: string }).type;
        if (dataType === "ads") {
          summaryData.adsData = data;
        } else if (dataType === "analytics") {
          summaryData.analyticsData = data;
        } else if (dataType === "search-console") {
          summaryData.searchConsoleData = data;
        }
      }

      const summaryText = await claude.generateExecutiveSummary(summaryData, "tr");
      result = { summary: summaryText };
      break;
    }

    case "recommendations": {
      // Extract SEO data for recommendations
      const seoData = inputData.find(d => (d as { type?: string }).type === "search-console") || {};
      const seoResult = seoData as {
        data?: {
          topQueries?: Array<{ keys: string[]; clicks: number; impressions: number; position: number }>;
          topPages?: Array<{ keys: string[]; clicks: number; impressions: number; position: number }>;
        };
      };

      const recommendations = await claude.generateSEORecommendations({
        topQueries: (seoResult.data?.topQueries || []).map(q => ({
          query: q.keys?.[0] || "",
          clicks: q.clicks,
          impressions: q.impressions,
          position: q.position,
        })),
        topPages: (seoResult.data?.topPages || []).map(p => ({
          page: p.keys?.[0] || "",
          clicks: p.clicks,
          impressions: p.impressions,
          position: p.position,
        })),
      }, "tr");
      result = { ...recommendations };
      break;
    }

    default: {
      const defaultInsights = await claude.generateInsights({
        reportType: "performance",
        data: inputData.reduce((acc, d, i) => ({ ...acc, [`source_${i}`]: d }), {}),
        language: "tr",
      });
      result = { ...defaultInsights };
    }
  }

  return result;
}

// Execute transform node
function executeTransformNode(
  config: TransformNodeConfig,
  context: WorkflowContext
): Record<string, unknown> {
  const { operation, inputNodeIds, options } = config;

  // Collect input data
  const inputs: unknown[] = [];
  for (const nodeId of inputNodeIds || []) {
    const nodeResult = context.nodeResults[nodeId];
    if (nodeResult) {
      inputs.push(nodeResult);
    }
  }

  switch (operation) {
    case "merge":
      return { merged: inputs };

    case "filter": {
      const filterFn = options?.filterFn;
      if (filterFn && Array.isArray(inputs[0])) {
        // Safe filtering without eval
        return { filtered: inputs[0] };
      }
      return { filtered: inputs };
    }

    case "aggregate": {
      // Simple aggregation
      const aggregated: Record<string, number> = {};
      for (const input of inputs) {
        if (typeof input === "object" && input !== null) {
          for (const [key, value] of Object.entries(input)) {
            if (typeof value === "number") {
              aggregated[key] = (aggregated[key] || 0) + value;
            }
          }
        }
      }
      return { aggregated };
    }

    default:
      return { transformed: inputs };
  }
}

// Execute export node
function executeExportNode(
  config: ExportNodeConfig,
  context: WorkflowContext
): Record<string, unknown> {
  const { format, inputNodeIds, template } = config;

  // Collect input data
  const sections: Record<string, unknown>[] = [];
  for (const nodeId of inputNodeIds || []) {
    const nodeResult = context.nodeResults[nodeId];
    if (nodeResult) {
      sections.push(nodeResult);
    }
  }

  // Prepare export data
  return {
    format,
    template,
    sections,
    metadata: {
      generatedAt: new Date().toISOString(),
      brandId: context.brandId,
      workflowId: context.workflowId,
    },
  };
}

// Main workflow executor
export async function executeWorkflow(
  workflowId: string,
  runId: string,
  userId: string
): Promise<WorkflowRunResult> {
  const startTime = Date.now();

  try {
    // Check rate limit
    const { success: rateLimitOk } = await rateLimiters.workflow.limit(userId);
    if (!rateLimitOk) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    // Get workflow
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      include: {
        brand: {
          include: { workspace: true },
        },
      },
    });

    if (!workflow) {
      throw new Error("Workflow not found");
    }

    // Update run status
    await prisma.workflowRun.update({
      where: { id: runId },
      data: { status: "RUNNING" },
    });

    // Parse workflow definition
    const nodes = workflow.nodes as unknown as WorkflowDefinition["nodes"];
    const edges = workflow.edges as unknown as WorkflowDefinition["edges"];

    // Create context with fresh date variables
    const savedVariables = (workflow.variables as Record<string, unknown>) || {};
    const freshDateVars = calculateDateVariables();

    const context: WorkflowContext = {
      workflowId,
      workspaceId: workflow.brand.workspaceId,
      brandId: workflow.brandId,
      variables: { ...savedVariables, ...freshDateVars },
      nodeResults: {},
    };

    // Topological sort for execution order
    const executionOrder = topologicalSort(nodes, edges);

    // Execute nodes in order
    let creditsUsed = 0;

    for (const nodeId of executionOrder) {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) continue;

      try {
        const result = await executeNode(node, context, workflow.brand.workspaceId);
        context.nodeResults[nodeId] = result;

        // Calculate credits based on node type
        switch (node.type) {
          case "data-source":
            creditsUsed += 1;
            break;
          case "ai-analysis":
            creditsUsed += 5;
            break;
          case "export":
            creditsUsed += 2;
            break;
          default:
            creditsUsed += 0.5;
        }
      } catch (nodeError) {
        console.error(`Node ${nodeId} failed:`, nodeError);
        context.nodeResults[nodeId] = {
          error: nodeError instanceof Error ? nodeError.message : "Unknown error",
        };
      }
    }

    // Update run with results
    await prisma.workflowRun.update({
      where: { id: runId },
      data: {
        status: "COMPLETED",
        nodeResults: JSON.parse(JSON.stringify(context.nodeResults)),
        creditsUsed: Math.ceil(creditsUsed),
        completedAt: new Date(),
      },
    });

    // Deduct credits from workspace
    await prisma.workspace.update({
      where: { id: workflow.brand.workspaceId },
      data: {
        credits: {
          decrement: Math.ceil(creditsUsed),
        },
      },
    });

    // Get user for notification
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Send notification email
    if (user?.email) {
      await sendTemplatedEmail(user.email, "workflowCompleted", {
        userName: user.name || "Kullanıcı",
        workflowName: workflow.name,
        reportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/workflows/${workflowId}`,
      });
    }

    return {
      success: true,
      runId,
      duration: Date.now() - startTime,
      creditsUsed: Math.ceil(creditsUsed),
      nodeResults: context.nodeResults,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // Update run with error
    await prisma.workflowRun.update({
      where: { id: runId },
      data: {
        status: "FAILED",
        error: errorMessage,
        completedAt: new Date(),
      },
    });

    // Get user and workflow for notification
    const run = await prisma.workflowRun.findUnique({
      where: { id: runId },
      include: {
        workflow: {
          include: {
            createdBy: true,
          },
        },
      },
    });

    if (run?.workflow.createdBy?.email) {
      await sendTemplatedEmail(run.workflow.createdBy.email, "workflowFailed", {
        userName: run.workflow.createdBy.name || "Kullanıcı",
        workflowName: run.workflow.name,
        errorMessage,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      });
    }

    return {
      success: false,
      runId,
      duration: Date.now() - startTime,
      creditsUsed: 0,
      error: errorMessage,
    };
  }
}

// Topological sort for node execution order
function topologicalSort(
  nodes: WorkflowDefinition["nodes"],
  edges: WorkflowDefinition["edges"]
): string[] {
  const inDegree = new Map<string, number>();
  const adjacencyList = new Map<string, string[]>();

  // Initialize
  for (const node of nodes) {
    inDegree.set(node.id, 0);
    adjacencyList.set(node.id, []);
  }

  // Build graph
  for (const edge of edges) {
    const neighbors = adjacencyList.get(edge.source) || [];
    neighbors.push(edge.target);
    adjacencyList.set(edge.source, neighbors);
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  }

  // Find nodes with no incoming edges
  const queue: string[] = [];
  for (const [nodeId, degree] of inDegree.entries()) {
    if (degree === 0) {
      queue.push(nodeId);
    }
  }

  // Process
  const result: string[] = [];
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    result.push(nodeId);

    for (const neighbor of adjacencyList.get(nodeId) || []) {
      const newDegree = (inDegree.get(neighbor) || 1) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  return result;
}
