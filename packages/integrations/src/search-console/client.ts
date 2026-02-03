import { google, searchconsole_v1 } from "googleapis";

// Use the OAuth2Client type from googleapis
type OAuth2Client = InstanceType<typeof google.auth.OAuth2>;

export interface SearchAnalyticsRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchAnalyticsReport {
  rows: SearchAnalyticsRow[];
  responseAggregationType?: string;
}

export interface SearchAnalyticsRequest {
  siteUrl: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  dimensions?: Array<"query" | "page" | "country" | "device" | "date">;
  searchType?: "web" | "image" | "video" | "news";
  rowLimit?: number;
  startRow?: number;
  dimensionFilterGroups?: Array<{
    filters: Array<{
      dimension: string;
      operator: "equals" | "contains" | "notContains";
      expression: string;
    }>;
  }>;
}

export interface SiteInfo {
  siteUrl: string;
  permissionLevel: string;
}

/**
 * Google Search Console API client
 */
export class SearchConsoleClient {
  private webmasters: searchconsole_v1.Searchconsole;
  private siteUrl: string;

  constructor(authClient: OAuth2Client, siteUrl: string) {
    this.webmasters = google.searchconsole({
      version: "v1",
      auth: authClient,
    });
    this.siteUrl = siteUrl;
  }

  /**
   * List all sites accessible by the authenticated user
   */
  async listSites(): Promise<SiteInfo[]> {
    const response = await this.webmasters.sites.list();
    return (response.data.siteEntry || []).map((site) => ({
      siteUrl: site.siteUrl || "",
      permissionLevel: site.permissionLevel || "",
    }));
  }

  /**
   * Run a search analytics query
   */
  async searchAnalytics(
    request: SearchAnalyticsRequest
  ): Promise<SearchAnalyticsReport> {
    const response = await this.webmasters.searchanalytics.query({
      siteUrl: request.siteUrl || this.siteUrl,
      requestBody: {
        startDate: request.startDate,
        endDate: request.endDate,
        dimensions: request.dimensions,
        searchType: request.searchType || "web",
        rowLimit: request.rowLimit || 1000,
        startRow: request.startRow || 0,
        dimensionFilterGroups: request.dimensionFilterGroups,
      },
    });

    return {
      rows: (response.data.rows || []).map((row) => ({
        keys: row.keys || [],
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: (row.ctr || 0) * 100, // Convert to percentage
        position: row.position || 0,
      })),
      responseAggregationType: response.data.responseAggregationType || undefined,
    };
  }

  /**
   * Get top queries
   */
  async getTopQueries(
    startDate: string,
    endDate: string,
    limit: number = 50
  ): Promise<SearchAnalyticsReport> {
    return this.searchAnalytics({
      siteUrl: this.siteUrl,
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit: limit,
    });
  }

  /**
   * Get top pages
   */
  async getTopPages(
    startDate: string,
    endDate: string,
    limit: number = 50
  ): Promise<SearchAnalyticsReport> {
    return this.searchAnalytics({
      siteUrl: this.siteUrl,
      startDate,
      endDate,
      dimensions: ["page"],
      rowLimit: limit,
    });
  }

  /**
   * Get performance by country
   */
  async getCountryPerformance(
    startDate: string,
    endDate: string
  ): Promise<SearchAnalyticsReport> {
    return this.searchAnalytics({
      siteUrl: this.siteUrl,
      startDate,
      endDate,
      dimensions: ["country"],
      rowLimit: 100,
    });
  }

  /**
   * Get performance by device
   */
  async getDevicePerformance(
    startDate: string,
    endDate: string
  ): Promise<SearchAnalyticsReport> {
    return this.searchAnalytics({
      siteUrl: this.siteUrl,
      startDate,
      endDate,
      dimensions: ["device"],
    });
  }

  /**
   * Get daily performance trend
   */
  async getDailyTrend(
    startDate: string,
    endDate: string
  ): Promise<SearchAnalyticsReport> {
    return this.searchAnalytics({
      siteUrl: this.siteUrl,
      startDate,
      endDate,
      dimensions: ["date"],
    });
  }

  /**
   * Get query performance for specific page
   */
  async getPageQueries(
    pageUrl: string,
    startDate: string,
    endDate: string,
    limit: number = 100
  ): Promise<SearchAnalyticsReport> {
    return this.searchAnalytics({
      siteUrl: this.siteUrl,
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit: limit,
      dimensionFilterGroups: [
        {
          filters: [
            {
              dimension: "page",
              operator: "equals",
              expression: pageUrl,
            },
          ],
        },
      ],
    });
  }

  /**
   * Get comprehensive SEO report
   */
  async getSEOReport(
    startDate: string,
    endDate: string
  ): Promise<{
    overview: { clicks: number; impressions: number; ctr: number; position: number };
    topQueries: SearchAnalyticsRow[];
    topPages: SearchAnalyticsRow[];
    deviceBreakdown: SearchAnalyticsRow[];
    countryBreakdown: SearchAnalyticsRow[];
    dailyTrend: SearchAnalyticsRow[];
  }> {
    const [queries, pages, devices, countries, daily] = await Promise.all([
      this.getTopQueries(startDate, endDate, 20),
      this.getTopPages(startDate, endDate, 20),
      this.getDevicePerformance(startDate, endDate),
      this.getCountryPerformance(startDate, endDate),
      this.getDailyTrend(startDate, endDate),
    ]);

    // Calculate overview from daily data
    const overview = daily.rows.reduce(
      (acc, row) => ({
        clicks: acc.clicks + row.clicks,
        impressions: acc.impressions + row.impressions,
        ctr: 0, // Will calculate after
        position: acc.position + row.position * row.impressions, // Weighted average
      }),
      { clicks: 0, impressions: 0, ctr: 0, position: 0 }
    );

    if (overview.impressions > 0) {
      overview.ctr = (overview.clicks / overview.impressions) * 100;
      overview.position = overview.position / overview.impressions;
    }

    return {
      overview,
      topQueries: queries.rows,
      topPages: pages.rows,
      deviceBreakdown: devices.rows,
      countryBreakdown: countries.rows.slice(0, 10),
      dailyTrend: daily.rows,
    };
  }
}
