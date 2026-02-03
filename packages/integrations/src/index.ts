// Common Google Auth utilities
export {
  createOAuth2Client,
  setCredentials,
  refreshAccessToken,
  GOOGLE_SCOPES,
  ALL_SCOPES,
} from "./common/google-auth";
export type { GoogleCredentials, GoogleAuthConfig } from "./common/google-auth";

// Google Analytics
export { GoogleAnalyticsClient } from "./google-analytics/client";
export type {
  AnalyticsMetric,
  AnalyticsDimension,
  AnalyticsRow,
  AnalyticsReport,
  AnalyticsReportRequest,
} from "./google-analytics/client";

// Google Ads
export { GoogleAdsClient } from "./google-ads/client";
export type {
  GoogleAdsConfig,
  CampaignMetrics,
  AdGroupMetrics,
  KeywordMetrics,
  AccountMetrics,
} from "./google-ads/client";

// Search Console
export { SearchConsoleClient } from "./search-console/client";
export type {
  SearchAnalyticsRow,
  SearchAnalyticsReport,
  SearchAnalyticsRequest,
  SiteInfo,
} from "./search-console/client";
