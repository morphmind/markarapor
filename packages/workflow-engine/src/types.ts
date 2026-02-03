/**
 * Workflow Engine Types
 */

export type NodeType =
  | "trigger"
  | "data-source"
  | "transform"
  | "ai-analysis"
  | "export"
  | "notification";

export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  config: Record<string, any>;
  position?: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  variables: Record<string, any>;
}

export interface WorkflowContext {
  workflowId: string;
  runId: string;
  brandId: string;
  workspaceId: string;
  variables: Record<string, any>;
  credentials: {
    google?: {
      accessToken: string;
      refreshToken: string;
    };
    anthropic?: {
      apiKey: string;
    };
  };
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export interface NodeExecutionResult {
  nodeId: string;
  status: "success" | "error" | "skipped";
  output?: any;
  error?: string;
  executionTime: number;
}

export interface WorkflowRunResult {
  runId: string;
  workflowId: string;
  status: "completed" | "failed" | "partial";
  nodeResults: NodeExecutionResult[];
  finalOutput?: any;
  totalExecutionTime: number;
  creditsUsed: number;
  startedAt: Date;
  completedAt: Date;
}

// Data source specific configs
export interface GoogleAdsSourceConfig {
  type: "google-ads";
  customerId: string;
  metrics: string[];
}

export interface GoogleAnalyticsSourceConfig {
  type: "google-analytics";
  propertyId: string;
  metrics: string[];
  dimensions?: string[];
}

export interface SearchConsoleSourceConfig {
  type: "search-console";
  siteUrl: string;
  dimensions?: string[];
}

export type DataSourceConfig =
  | GoogleAdsSourceConfig
  | GoogleAnalyticsSourceConfig
  | SearchConsoleSourceConfig;

// Transform configs
export interface TransformConfig {
  operation: "merge" | "filter" | "aggregate" | "calculate";
  params: Record<string, any>;
}

// AI analysis configs
export interface AIAnalysisConfig {
  type: "insights" | "summary" | "recommendations";
  model?: string;
  language?: "tr" | "en";
  tone?: "professional" | "casual" | "executive";
}

// Export configs
export interface ExportConfig {
  format: "pdf" | "docx" | "slides" | "sheets";
  template?: string;
  destination?: "download" | "drive" | "email";
}

// Notification configs
export interface NotificationConfig {
  type: "email" | "slack" | "webhook";
  recipients?: string[];
  webhookUrl?: string;
  template?: string;
}
