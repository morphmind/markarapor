import type { WorkflowNode, WorkflowContext, AIAnalysisConfig } from "../types";
import { ClaudeClient } from "@markarapor/ai";

/**
 * Execute an AI analysis node
 */
export async function executeAIAnalysisNode(
  node: WorkflowNode,
  context: WorkflowContext,
  inputs: Record<string, any>
): Promise<any> {
  const config = node.config as AIAnalysisConfig;

  if (!context.credentials.anthropic?.apiKey) {
    throw new Error("Anthropic API key not provided");
  }

  const client = new ClaudeClient({
    apiKey: context.credentials.anthropic.apiKey,
    model: config.model,
  });

  // Combine all inputs into a single data object
  const combinedData = Object.values(inputs).reduce((acc, input) => {
    if (typeof input === "object" && input !== null) {
      return { ...acc, ...input };
    }
    return acc;
  }, {});

  switch (config.type) {
    case "insights":
      return executeInsightsAnalysis(client, combinedData, config);

    case "summary":
      return executeSummaryAnalysis(client, combinedData, config);

    case "recommendations":
      return executeRecommendationsAnalysis(client, combinedData, config);

    default:
      throw new Error(`Unknown AI analysis type: ${config.type}`);
  }
}

async function executeInsightsAnalysis(
  client: ClaudeClient,
  data: Record<string, any>,
  config: AIAnalysisConfig
): Promise<any> {
  // Determine report type based on data sources
  let reportType: "performance" | "seo" | "campaign" | "executive" = "performance";

  if (data.source === "search-console") {
    reportType = "seo";
  } else if (data.source === "google-ads" && data.campaigns) {
    reportType = "campaign";
  } else if (data.adsData && data.analyticsData) {
    reportType = "executive";
  }

  const insights = await client.generateInsights({
    reportType,
    data,
    language: config.language || "tr",
    tone: config.tone || "professional",
  });

  return {
    type: "insights",
    reportType,
    ...insights,
  };
}

async function executeSummaryAnalysis(
  client: ClaudeClient,
  data: Record<string, any>,
  config: AIAnalysisConfig
): Promise<any> {
  // Organize data by source type
  const organizedData = {
    adsData: data.source === "google-ads" ? data : data.adsData,
    analyticsData: data.source === "google-analytics" ? data : data.analyticsData,
    searchConsoleData: data.source === "search-console" ? data : data.searchConsoleData,
  };

  const summary = await client.generateExecutiveSummary(
    organizedData,
    config.language || "tr"
  );

  return {
    type: "summary",
    content: summary,
  };
}

async function executeRecommendationsAnalysis(
  client: ClaudeClient,
  data: Record<string, any>,
  config: AIAnalysisConfig
): Promise<any> {
  // Check what type of data we have
  if (data.source === "google-ads" && data.campaigns) {
    const analysis = await client.analyzeCampaigns(
      data.campaigns,
      config.language || "tr"
    );

    return {
      type: "campaign-recommendations",
      ...analysis,
    };
  }

  if (data.source === "search-console" || data.topQueries) {
    const seoData = {
      topQueries: data.topQueries || [],
      topPages: data.topPages || [],
    };

    const recommendations = await client.generateSEORecommendations(
      seoData,
      config.language || "tr"
    );

    return {
      type: "seo-recommendations",
      ...recommendations,
    };
  }

  // Default: generate general insights
  const insights = await client.generateInsights({
    reportType: "performance",
    data,
    language: config.language || "tr",
    tone: config.tone || "professional",
  });

  return {
    type: "general-recommendations",
    recommendations: insights.recommendations,
  };
}
