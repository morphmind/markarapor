import { GoogleAdsApi, Customer, enums } from "google-ads-api";

export interface GoogleAdsConfig {
  clientId: string;
  clientSecret: string;
  developerToken: string;
  refreshToken: string;
  customerId: string; // Without dashes (e.g., "1234567890")
  loginCustomerId?: string; // For MCC accounts
}

export interface CampaignMetrics {
  campaignId: string;
  campaignName: string;
  status: string;
  impressions: number;
  clicks: number;
  cost: number; // in micros, divide by 1_000_000
  conversions: number;
  conversionValue: number;
  ctr: number;
  averageCpc: number;
}

export interface AdGroupMetrics {
  adGroupId: string;
  adGroupName: string;
  campaignName: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
}

export interface KeywordMetrics {
  keyword: string;
  matchType: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  qualityScore?: number;
}

export interface AccountMetrics {
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  conversionValue: number;
  ctr: number;
  averageCpc: number;
  costPerConversion: number;
}

/**
 * Google Ads API client
 */
export class GoogleAdsClient {
  private client: GoogleAdsApi;
  private customer: Customer;

  constructor(config: GoogleAdsConfig) {
    this.client = new GoogleAdsApi({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      developer_token: config.developerToken,
    });

    this.customer = this.client.Customer({
      customer_id: config.customerId,
      login_customer_id: config.loginCustomerId,
      refresh_token: config.refreshToken,
    });
  }

  /**
   * Get account-level metrics for a date range
   */
  async getAccountMetrics(
    startDate: string,
    endDate: string
  ): Promise<AccountMetrics> {
    const query = `
      SELECT
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_value,
        metrics.ctr,
        metrics.average_cpc,
        metrics.cost_per_conversion
      FROM customer
      WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
    `;

    const results = await this.customer.query(query);

    // Aggregate results
    let metrics: AccountMetrics = {
      impressions: 0,
      clicks: 0,
      cost: 0,
      conversions: 0,
      conversionValue: 0,
      ctr: 0,
      averageCpc: 0,
      costPerConversion: 0,
    };

    for (const row of results) {
      metrics.impressions += Number(row.metrics?.impressions || 0);
      metrics.clicks += Number(row.metrics?.clicks || 0);
      metrics.cost += Number(row.metrics?.cost_micros || 0) / 1_000_000;
      metrics.conversions += Number(row.metrics?.conversions || 0);
      metrics.conversionValue += Number(row.metrics?.conversions_value || 0);
    }

    // Calculate derived metrics
    if (metrics.impressions > 0) {
      metrics.ctr = (metrics.clicks / metrics.impressions) * 100;
    }
    if (metrics.clicks > 0) {
      metrics.averageCpc = metrics.cost / metrics.clicks;
    }
    if (metrics.conversions > 0) {
      metrics.costPerConversion = metrics.cost / metrics.conversions;
    }

    return metrics;
  }

  /**
   * Get campaign-level performance
   */
  async getCampaignMetrics(
    startDate: string,
    endDate: string
  ): Promise<CampaignMetrics[]> {
    const query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_value,
        metrics.ctr,
        metrics.average_cpc
      FROM campaign
      WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
        AND campaign.status != 'REMOVED'
      ORDER BY metrics.cost_micros DESC
    `;

    const results = await this.customer.query(query);

    return results.map((row) => ({
      campaignId: String(row.campaign?.id || ""),
      campaignName: row.campaign?.name || "",
      status: String(row.campaign?.status || "UNKNOWN"),
      impressions: Number(row.metrics?.impressions || 0),
      clicks: Number(row.metrics?.clicks || 0),
      cost: Number(row.metrics?.cost_micros || 0) / 1_000_000,
      conversions: Number(row.metrics?.conversions || 0),
      conversionValue: Number(row.metrics?.conversions_value || 0),
      ctr: Number(row.metrics?.ctr || 0) * 100,
      averageCpc: Number(row.metrics?.average_cpc || 0) / 1_000_000,
    }));
  }

  /**
   * Get ad group performance
   */
  async getAdGroupMetrics(
    startDate: string,
    endDate: string,
    campaignId?: string
  ): Promise<AdGroupMetrics[]> {
    let whereClause = `segments.date BETWEEN '${startDate}' AND '${endDate}'`;
    if (campaignId) {
      whereClause += ` AND campaign.id = ${campaignId}`;
    }

    const query = `
      SELECT
        ad_group.id,
        ad_group.name,
        campaign.name,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions
      FROM ad_group
      WHERE ${whereClause}
      ORDER BY metrics.cost_micros DESC
      LIMIT 100
    `;

    const results = await this.customer.query(query);

    return results.map((row) => ({
      adGroupId: String(row.ad_group?.id || ""),
      adGroupName: row.ad_group?.name || "",
      campaignName: row.campaign?.name || "",
      impressions: Number(row.metrics?.impressions || 0),
      clicks: Number(row.metrics?.clicks || 0),
      cost: Number(row.metrics?.cost_micros || 0) / 1_000_000,
      conversions: Number(row.metrics?.conversions || 0),
    }));
  }

  /**
   * Get keyword performance
   */
  async getKeywordMetrics(
    startDate: string,
    endDate: string,
    limit: number = 50
  ): Promise<KeywordMetrics[]> {
    const query = `
      SELECT
        ad_group_criterion.keyword.text,
        ad_group_criterion.keyword.match_type,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        ad_group_criterion.quality_info.quality_score
      FROM keyword_view
      WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
      ORDER BY metrics.impressions DESC
      LIMIT ${limit}
    `;

    const results = await this.customer.query(query);

    return results.map((row) => ({
      keyword: row.ad_group_criterion?.keyword?.text || "",
      matchType: String(row.ad_group_criterion?.keyword?.match_type || "UNKNOWN"),
      impressions: Number(row.metrics?.impressions || 0),
      clicks: Number(row.metrics?.clicks || 0),
      cost: Number(row.metrics?.cost_micros || 0) / 1_000_000,
      conversions: Number(row.metrics?.conversions || 0),
      qualityScore: row.ad_group_criterion?.quality_info?.quality_score
        ? Number(row.ad_group_criterion.quality_info.quality_score)
        : undefined,
    }));
  }

  /**
   * Get daily performance trend
   */
  async getDailyTrend(
    startDate: string,
    endDate: string
  ): Promise<
    Array<{
      date: string;
      impressions: number;
      clicks: number;
      cost: number;
      conversions: number;
    }>
  > {
    const query = `
      SELECT
        segments.date,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions
      FROM customer
      WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
      ORDER BY segments.date ASC
    `;

    const results = await this.customer.query(query);

    return results.map((row) => ({
      date: row.segments?.date || "",
      impressions: Number(row.metrics?.impressions || 0),
      clicks: Number(row.metrics?.clicks || 0),
      cost: Number(row.metrics?.cost_micros || 0) / 1_000_000,
      conversions: Number(row.metrics?.conversions || 0),
    }));
  }
}
