import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { google } from "googleapis";

// Use the OAuth2Client type from googleapis
type OAuth2Client = InstanceType<typeof google.auth.OAuth2>;

export interface AnalyticsMetric {
  name: string;
  value: number;
}

export interface AnalyticsDimension {
  name: string;
  value: string;
}

export interface AnalyticsRow {
  dimensions: AnalyticsDimension[];
  metrics: AnalyticsMetric[];
}

export interface AnalyticsReport {
  rows: AnalyticsRow[];
  rowCount: number;
  metadata?: {
    currencyCode?: string;
    timeZone?: string;
  };
}

export interface AnalyticsReportRequest {
  propertyId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  metrics: string[];
  dimensions?: string[];
  limit?: number;
}

/**
 * Google Analytics 4 Data API client
 */
export class GoogleAnalyticsClient {
  private client: BetaAnalyticsDataClient;
  private propertyId: string;

  constructor(authClient: OAuth2Client, propertyId: string) {
    this.client = new BetaAnalyticsDataClient({
      authClient: authClient as any,
    });
    this.propertyId = propertyId;
  }

  /**
   * Run a report with specified metrics and dimensions
   */
  async runReport(request: AnalyticsReportRequest): Promise<AnalyticsReport> {
    const [response] = await this.client.runReport({
      property: `properties/${request.propertyId || this.propertyId}`,
      dateRanges: [
        {
          startDate: request.startDate,
          endDate: request.endDate,
        },
      ],
      metrics: request.metrics.map((name) => ({ name })),
      dimensions: request.dimensions?.map((name) => ({ name })),
      limit: request.limit || 10000,
    });

    const rows: AnalyticsRow[] = (response.rows || []).map((row) => ({
      dimensions: (row.dimensionValues || []).map((dim, idx) => ({
        name: request.dimensions?.[idx] || `dimension_${idx}`,
        value: dim.value || "",
      })),
      metrics: (row.metricValues || []).map((metric, idx) => ({
        name: request.metrics[idx] || `metric_${idx}`,
        value: parseFloat(metric.value || "0"),
      })),
    }));

    return {
      rows,
      rowCount: parseInt(response.rowCount?.toString() || "0", 10),
      metadata: {
        currencyCode: response.metadata?.currencyCode || undefined,
        timeZone: response.metadata?.timeZone || undefined,
      },
    };
  }

  /**
   * Get basic traffic metrics
   */
  async getTrafficOverview(
    startDate: string,
    endDate: string
  ): Promise<AnalyticsReport> {
    return this.runReport({
      propertyId: this.propertyId,
      startDate,
      endDate,
      metrics: [
        "sessions",
        "totalUsers",
        "newUsers",
        "screenPageViews",
        "bounceRate",
        "averageSessionDuration",
        "engagementRate",
      ],
      dimensions: ["date"],
    });
  }

  /**
   * Get traffic by source/medium
   */
  async getTrafficSources(
    startDate: string,
    endDate: string
  ): Promise<AnalyticsReport> {
    return this.runReport({
      propertyId: this.propertyId,
      startDate,
      endDate,
      metrics: ["sessions", "totalUsers", "conversions", "engagementRate"],
      dimensions: ["sessionSourceMedium"],
      limit: 50,
    });
  }

  /**
   * Get top pages
   */
  async getTopPages(
    startDate: string,
    endDate: string
  ): Promise<AnalyticsReport> {
    return this.runReport({
      propertyId: this.propertyId,
      startDate,
      endDate,
      metrics: ["screenPageViews", "averageSessionDuration", "bounceRate"],
      dimensions: ["pagePath", "pageTitle"],
      limit: 20,
    });
  }

  /**
   * Get device breakdown
   */
  async getDeviceBreakdown(
    startDate: string,
    endDate: string
  ): Promise<AnalyticsReport> {
    return this.runReport({
      propertyId: this.propertyId,
      startDate,
      endDate,
      metrics: ["sessions", "totalUsers"],
      dimensions: ["deviceCategory"],
    });
  }

  /**
   * Get geographic data
   */
  async getGeographicData(
    startDate: string,
    endDate: string
  ): Promise<AnalyticsReport> {
    return this.runReport({
      propertyId: this.propertyId,
      startDate,
      endDate,
      metrics: ["sessions", "totalUsers", "engagementRate"],
      dimensions: ["country", "city"],
      limit: 50,
    });
  }
}
