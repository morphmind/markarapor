/**
 * Workflow template configurations
 * Her şablon için hazır node ve edge yapılandırmaları
 */

export interface WorkflowTemplateConfig {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  variables: Record<string, unknown>;
}

interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    config: Record<string, unknown>;
  };
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export const workflowTemplates: Record<string, WorkflowTemplateConfig> = {
  "monthly-performance": {
    id: "monthly-performance",
    name: "Aylık Performans Raporu",
    description: "Google Ads + Analytics verilerini birleştiren kapsamlı aylık rapor",
    nodes: [
      {
        id: "node-1",
        type: "data-source",
        position: { x: 100, y: 100 },
        data: {
          label: "Google Analytics",
          config: {
            source: "GOOGLE_ANALYTICS",
            dateRange: { startDate: "{{lastMonthStart}}", endDate: "{{lastMonthEnd}}" },
            metrics: ["sessions", "totalUsers", "newUsers", "screenPageViews", "bounceRate", "averageSessionDuration"],
            dimensions: ["date"],
          },
        },
      },
      {
        id: "node-2",
        type: "data-source",
        position: { x: 100, y: 250 },
        data: {
          label: "Google Ads",
          config: {
            source: "GOOGLE_ADS",
            dateRange: { startDate: "{{lastMonthStart}}", endDate: "{{lastMonthEnd}}" },
          },
        },
      },
      {
        id: "node-3",
        type: "transform",
        position: { x: 350, y: 175 },
        data: {
          label: "Verileri Birleştir",
          config: {
            operation: "merge",
            inputNodeIds: ["node-1", "node-2"],
          },
        },
      },
      {
        id: "node-4",
        type: "ai-analysis",
        position: { x: 550, y: 175 },
        data: {
          label: "AI Analizi",
          config: {
            analysisType: "insights",
            inputNodeIds: ["node-3"],
          },
        },
      },
      {
        id: "node-5",
        type: "export",
        position: { x: 750, y: 175 },
        data: {
          label: "PDF Rapor",
          config: {
            format: "pdf",
            inputNodeIds: ["node-3", "node-4"],
            template: "monthly-performance",
          },
        },
      },
    ],
    edges: [
      { id: "e1-3", source: "node-1", target: "node-3" },
      { id: "e2-3", source: "node-2", target: "node-3" },
      { id: "e3-4", source: "node-3", target: "node-4" },
      { id: "e4-5", source: "node-4", target: "node-5" },
    ],
    variables: {
      lastMonthStart: "auto",
      lastMonthEnd: "auto",
    },
  },

  "seo-report": {
    id: "seo-report",
    name: "SEO Performans Raporu",
    description: "Search Console verileriyle organik arama performansı analizi",
    nodes: [
      {
        id: "node-1",
        type: "data-source",
        position: { x: 100, y: 150 },
        data: {
          label: "Search Console",
          config: {
            source: "GOOGLE_SEARCH_CONSOLE",
            dateRange: { startDate: "{{lastMonthStart}}", endDate: "{{lastMonthEnd}}" },
          },
        },
      },
      {
        id: "node-2",
        type: "ai-analysis",
        position: { x: 350, y: 150 },
        data: {
          label: "SEO Önerileri",
          config: {
            analysisType: "recommendations",
            inputNodeIds: ["node-1"],
          },
        },
      },
      {
        id: "node-3",
        type: "export",
        position: { x: 600, y: 150 },
        data: {
          label: "PDF Rapor",
          config: {
            format: "pdf",
            inputNodeIds: ["node-1", "node-2"],
            template: "seo-report",
          },
        },
      },
    ],
    edges: [
      { id: "e1-2", source: "node-1", target: "node-2" },
      { id: "e2-3", source: "node-2", target: "node-3" },
    ],
    variables: {
      lastMonthStart: "auto",
      lastMonthEnd: "auto",
    },
  },

  "ads-campaign": {
    id: "ads-campaign",
    name: "Kampanya Analizi",
    description: "Google Ads kampanya bazlı detaylı performans raporu",
    nodes: [
      {
        id: "node-1",
        type: "data-source",
        position: { x: 100, y: 150 },
        data: {
          label: "Google Ads",
          config: {
            source: "GOOGLE_ADS",
            dateRange: { startDate: "{{lastWeekStart}}", endDate: "{{lastWeekEnd}}" },
          },
        },
      },
      {
        id: "node-2",
        type: "ai-analysis",
        position: { x: 350, y: 150 },
        data: {
          label: "Kampanya Analizi",
          config: {
            analysisType: "insights",
            inputNodeIds: ["node-1"],
          },
        },
      },
      {
        id: "node-3",
        type: "export",
        position: { x: 600, y: 150 },
        data: {
          label: "PDF Rapor",
          config: {
            format: "pdf",
            inputNodeIds: ["node-1", "node-2"],
            template: "ads-campaign",
          },
        },
      },
    ],
    edges: [
      { id: "e1-2", source: "node-1", target: "node-2" },
      { id: "e2-3", source: "node-2", target: "node-3" },
    ],
    variables: {
      lastWeekStart: "auto",
      lastWeekEnd: "auto",
    },
  },

  "seo-monthly-report": {
    id: "seo-monthly-report",
    name: "Aylık SEO Raporu (Kapsamlı)",
    description: "Google Analytics + Search Console birleşik SEO performans raporu - Organik trafik, arama sorguları, cihaz/ülke analizleri",
    nodes: [
      {
        id: "analytics-data",
        type: "data-source",
        position: { x: 50, y: 50 },
        data: {
          label: "Google Analytics",
          config: {
            source: "GOOGLE_ANALYTICS",
            dateRange: { startDate: "{{lastMonthStart}}", endDate: "{{lastMonthEnd}}" },
            metrics: [
              "sessions",
              "totalUsers",
              "newUsers",
              "screenPageViews",
              "bounceRate",
              "averageSessionDuration",
              "engagedSessions",
              "engagementRate",
            ],
            dimensions: ["date", "sessionDefaultChannelGroup", "sessionSource", "deviceCategory", "landingPage"],
          },
        },
      },
      {
        id: "search-console-data",
        type: "data-source",
        position: { x: 50, y: 200 },
        data: {
          label: "Search Console",
          config: {
            source: "GOOGLE_SEARCH_CONSOLE",
            dateRange: { startDate: "{{lastMonthStart}}", endDate: "{{lastMonthEnd}}" },
          },
        },
      },
      {
        id: "merge-data",
        type: "transform",
        position: { x: 300, y: 125 },
        data: {
          label: "Verileri Birleştir",
          config: {
            operation: "merge",
            inputNodeIds: ["analytics-data", "search-console-data"],
          },
        },
      },
      {
        id: "seo-overview",
        type: "ai-analysis",
        position: { x: 500, y: 50 },
        data: {
          label: "SEO Performans Özeti",
          config: {
            analysisType: "summary",
            inputNodeIds: ["merge-data"],
            prompt: "Organik trafik performansını, arama görünürlüğünü ve SEO trendlerini analiz et. Aylık değişimleri vurgula.",
          },
        },
      },
      {
        id: "seo-insights",
        type: "ai-analysis",
        position: { x: 500, y: 200 },
        data: {
          label: "SEO Önerileri",
          config: {
            analysisType: "recommendations",
            inputNodeIds: ["merge-data"],
            prompt: "Organik trafik ve arama performansı verilerine dayanarak hızlı kazanımlar ve uzun vadeli SEO stratejileri öner.",
          },
        },
      },
      {
        id: "detailed-insights",
        type: "ai-analysis",
        position: { x: 500, y: 350 },
        data: {
          label: "Detaylı Bulgular",
          config: {
            analysisType: "insights",
            inputNodeIds: ["merge-data"],
            prompt: "Cihaz dağılımı, ülke analizi, en iyi sorgular, yükselen/düşen sayfalar hakkında detaylı bulgular çıkar.",
          },
        },
      },
      {
        id: "export-pdf",
        type: "export",
        position: { x: 750, y: 200 },
        data: {
          label: "PDF Rapor",
          config: {
            format: "pdf",
            inputNodeIds: ["merge-data", "seo-overview", "seo-insights", "detailed-insights"],
            template: "seo-monthly-report",
          },
        },
      },
    ],
    edges: [
      { id: "e-a-m", source: "analytics-data", target: "merge-data" },
      { id: "e-sc-m", source: "search-console-data", target: "merge-data" },
      { id: "e-m-ov", source: "merge-data", target: "seo-overview" },
      { id: "e-m-ins", source: "merge-data", target: "seo-insights" },
      { id: "e-m-det", source: "merge-data", target: "detailed-insights" },
      { id: "e-ov-exp", source: "seo-overview", target: "export-pdf" },
      { id: "e-ins-exp", source: "seo-insights", target: "export-pdf" },
      { id: "e-det-exp", source: "detailed-insights", target: "export-pdf" },
    ],
    variables: {
      lastMonthStart: "auto",
      lastMonthEnd: "auto",
    },
  },

  "executive-summary": {
    id: "executive-summary",
    name: "Yönetici Özeti",
    description: "AI destekli kısa ve öz yönetici brifingi",
    nodes: [
      {
        id: "node-1",
        type: "data-source",
        position: { x: 100, y: 100 },
        data: {
          label: "Google Analytics",
          config: {
            source: "GOOGLE_ANALYTICS",
            dateRange: { startDate: "{{lastMonthStart}}", endDate: "{{lastMonthEnd}}" },
            metrics: ["sessions", "totalUsers", "conversions"],
            dimensions: ["date"],
          },
        },
      },
      {
        id: "node-2",
        type: "data-source",
        position: { x: 100, y: 250 },
        data: {
          label: "Google Ads",
          config: {
            source: "GOOGLE_ADS",
            dateRange: { startDate: "{{lastMonthStart}}", endDate: "{{lastMonthEnd}}" },
          },
        },
      },
      {
        id: "node-3",
        type: "data-source",
        position: { x: 100, y: 400 },
        data: {
          label: "Search Console",
          config: {
            source: "GOOGLE_SEARCH_CONSOLE",
            dateRange: { startDate: "{{lastMonthStart}}", endDate: "{{lastMonthEnd}}" },
          },
        },
      },
      {
        id: "node-4",
        type: "transform",
        position: { x: 350, y: 250 },
        data: {
          label: "Verileri Birleştir",
          config: {
            operation: "merge",
            inputNodeIds: ["node-1", "node-2", "node-3"],
          },
        },
      },
      {
        id: "node-5",
        type: "ai-analysis",
        position: { x: 550, y: 250 },
        data: {
          label: "Yönetici Özeti",
          config: {
            analysisType: "summary",
            inputNodeIds: ["node-4"],
          },
        },
      },
      {
        id: "node-6",
        type: "export",
        position: { x: 750, y: 250 },
        data: {
          label: "PDF Rapor",
          config: {
            format: "pdf",
            inputNodeIds: ["node-4", "node-5"],
            template: "executive-summary",
          },
        },
      },
    ],
    edges: [
      { id: "e1-4", source: "node-1", target: "node-4" },
      { id: "e2-4", source: "node-2", target: "node-4" },
      { id: "e3-4", source: "node-3", target: "node-4" },
      { id: "e4-5", source: "node-4", target: "node-5" },
      { id: "e5-6", source: "node-5", target: "node-6" },
    ],
    variables: {
      lastMonthStart: "auto",
      lastMonthEnd: "auto",
    },
  },
};

/**
 * Get template configuration by ID
 */
export function getTemplateConfig(templateId: string): WorkflowTemplateConfig | null {
  return workflowTemplates[templateId] || null;
}

/**
 * Get all available templates
 */
export function getAllTemplates(): WorkflowTemplateConfig[] {
  return Object.values(workflowTemplates);
}

/**
 * Calculate date variables for templates
 */
export function calculateDateVariables(): Record<string, string> {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const lastWeekStart = new Date(now);
  lastWeekStart.setDate(now.getDate() - 7);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  return {
    lastMonthStart: formatDate(lastMonth),
    lastMonthEnd: formatDate(lastMonthEnd),
    lastWeekStart: formatDate(lastWeekStart),
    lastWeekEnd: formatDate(now),
    today: formatDate(now),
  };
}
