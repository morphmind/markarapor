import { google } from "googleapis";

// Use the OAuth2Client type from googleapis
type OAuth2Client = InstanceType<typeof google.auth.OAuth2>;

export interface GoogleCredentials {
  accessToken: string;
  refreshToken: string;
  expiresAt?: Date;
}

export interface GoogleAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri?: string;
}

/**
 * Creates an OAuth2 client for Google APIs
 */
export function createOAuth2Client(config: GoogleAuthConfig): OAuth2Client {
  return new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUri
  );
}

/**
 * Sets credentials on an OAuth2 client
 */
export function setCredentials(
  client: OAuth2Client,
  credentials: GoogleCredentials
): OAuth2Client {
  client.setCredentials({
    access_token: credentials.accessToken,
    refresh_token: credentials.refreshToken,
    expiry_date: credentials.expiresAt?.getTime(),
  });
  return client;
}

/**
 * Refreshes the access token if needed
 */
export async function refreshAccessToken(
  client: OAuth2Client
): Promise<string | null> {
  try {
    const { credentials } = await client.refreshAccessToken();
    return credentials.access_token || null;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    return null;
  }
}

/**
 * Google API scopes for different services
 */
export const GOOGLE_SCOPES = {
  // Google Ads
  ADS: "https://www.googleapis.com/auth/adwords",

  // Google Analytics 4
  ANALYTICS_READONLY: "https://www.googleapis.com/auth/analytics.readonly",

  // Search Console
  WEBMASTERS_READONLY: "https://www.googleapis.com/auth/webmasters.readonly",

  // Google Drive (for exporting reports)
  DRIVE_FILE: "https://www.googleapis.com/auth/drive.file",

  // Google Slides
  PRESENTATIONS: "https://www.googleapis.com/auth/presentations",

  // Google Sheets
  SPREADSHEETS: "https://www.googleapis.com/auth/spreadsheets",
} as const;

/**
 * All scopes needed for MarkaRapor
 */
export const ALL_SCOPES = [
  GOOGLE_SCOPES.ADS,
  GOOGLE_SCOPES.ANALYTICS_READONLY,
  GOOGLE_SCOPES.WEBMASTERS_READONLY,
  GOOGLE_SCOPES.DRIVE_FILE,
  GOOGLE_SCOPES.PRESENTATIONS,
  GOOGLE_SCOPES.SPREADSHEETS,
];
