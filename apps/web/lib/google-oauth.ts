import { google } from "googleapis";
import { prisma } from "@markarapor/database";
import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "markarapor-default-key-32ch";
const IV_LENGTH = 16;

// Encryption helpers
function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(text: string): string {
  const parts = text.split(":");
  const iv = Buffer.from(parts[0], "hex");
  const encryptedText = parts[1];
  const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Google OAuth2 client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createOAuth2Client(): any {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/google/callback`
  );
}

// Scopes for each provider
export const PROVIDER_SCOPES = {
  GOOGLE_ADS: ["https://www.googleapis.com/auth/adwords"],
  GOOGLE_ANALYTICS: ["https://www.googleapis.com/auth/analytics.readonly"],
  GOOGLE_SEARCH_CONSOLE: ["https://www.googleapis.com/auth/webmasters.readonly"],
  GOOGLE_SLIDES: ["https://www.googleapis.com/auth/presentations"],
  GOOGLE_SHEETS: ["https://www.googleapis.com/auth/spreadsheets"],
  GOOGLE_DRIVE: ["https://www.googleapis.com/auth/drive.file"],
} as const;

export type ConnectionProvider = keyof typeof PROVIDER_SCOPES;

// Generate OAuth URL for a specific provider
export function generateAuthUrl(
  provider: ConnectionProvider,
  state: string
): string {
  const oauth2Client = createOAuth2Client();

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: PROVIDER_SCOPES[provider],
    state,
  });
}

// Exchange code for tokens
export async function exchangeCodeForTokens(code: string) {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

// Store connection with encrypted tokens
export async function createConnectionWithTokens(data: {
  workspaceId: string;
  brandId?: string;
  provider: ConnectionProvider;
  name: string;
  accessToken: string;
  refreshToken?: string | null;
  expiresAt?: number | null;
  accountId?: string;
  accountName?: string;
  propertyId?: string;
  propertyName?: string;
}) {
  // Encrypt tokens
  const encryptedAccessToken = encrypt(data.accessToken);
  const encryptedRefreshToken = data.refreshToken
    ? encrypt(data.refreshToken)
    : null;

  // Create connection
  const connection = await prisma.connection.create({
    data: {
      workspaceId: data.workspaceId,
      provider: data.provider,
      name: data.name,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      tokenExpiresAt: data.expiresAt
        ? new Date(data.expiresAt * 1000)
        : null,
      accountId: data.accountId,
      accountName: data.accountName,
      status: "ACTIVE",
    },
  });

  // If brandId provided, link to brand
  if (data.brandId) {
    await prisma.brandConnection.create({
      data: {
        brandId: data.brandId,
        connectionId: connection.id,
        propertyId: data.propertyId,
        propertyName: data.propertyName,
        isDefault: true,
      },
    });
  }

  return connection;
}

// Get decrypted tokens for a connection
export async function getConnectionTokens(connectionId: string) {
  const connection = await prisma.connection.findUnique({
    where: { id: connectionId },
  });

  if (!connection) {
    throw new Error("Connection not found");
  }

  return {
    accessToken: decrypt(connection.accessToken),
    refreshToken: connection.refreshToken
      ? decrypt(connection.refreshToken)
      : null,
    expiresAt: connection.tokenExpiresAt,
  };
}

// Refresh tokens if expired
export async function refreshConnectionTokens(connectionId: string) {
  const connection = await prisma.connection.findUnique({
    where: { id: connectionId },
  });

  if (!connection) {
    throw new Error("Connection not found");
  }

  if (!connection.refreshToken) {
    throw new Error("No refresh token available");
  }

  const oauth2Client = createOAuth2Client();
  const refreshToken = decrypt(connection.refreshToken);

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  try {
    const { credentials } = await oauth2Client.refreshAccessToken();

    // Update connection with new tokens
    const encryptedAccessToken = encrypt(credentials.access_token!);
    const encryptedRefreshToken = credentials.refresh_token
      ? encrypt(credentials.refresh_token)
      : connection.refreshToken;

    await prisma.connection.update({
      where: { id: connectionId },
      data: {
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        tokenExpiresAt: credentials.expiry_date
          ? new Date(credentials.expiry_date)
          : null,
        status: "ACTIVE",
        lastTestedAt: new Date(),
      },
    });

    return {
      accessToken: credentials.access_token!,
      refreshToken: credentials.refresh_token || refreshToken,
      expiresAt: credentials.expiry_date
        ? new Date(credentials.expiry_date)
        : null,
    };
  } catch (error) {
    // Mark connection as expired
    await prisma.connection.update({
      where: { id: connectionId },
      data: {
        status: "EXPIRED",
      },
    });
    throw error;
  }
}

// Get valid access token (refresh if needed)
export async function getValidAccessToken(connectionId: string): Promise<string> {
  const connection = await prisma.connection.findUnique({
    where: { id: connectionId },
  });

  if (!connection) {
    throw new Error("Connection not found");
  }

  // Check if token is expired or will expire soon (5 min buffer)
  const now = new Date();
  const bufferTime = 5 * 60 * 1000; // 5 minutes
  const isExpired =
    connection.tokenExpiresAt &&
    connection.tokenExpiresAt.getTime() - bufferTime < now.getTime();

  if (isExpired && connection.refreshToken) {
    const refreshed = await refreshConnectionTokens(connectionId);
    return refreshed.accessToken;
  }

  return decrypt(connection.accessToken);
}

// OAuth state management (stores temporary state for OAuth flow)
const oauthStateStore = new Map<
  string,
  {
    workspaceId: string;
    brandId?: string;
    provider: ConnectionProvider;
    name: string;
    propertyId?: string;
    propertyName?: string;
    createdAt: number;
  }
>();

// Clean up old states (older than 10 minutes)
function cleanupOldStates() {
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  for (const [key, value] of oauthStateStore.entries()) {
    if (value.createdAt < tenMinutesAgo) {
      oauthStateStore.delete(key);
    }
  }
}

export function createOAuthState(data: {
  workspaceId: string;
  brandId?: string;
  provider: ConnectionProvider;
  name: string;
  propertyId?: string;
  propertyName?: string;
}): string {
  cleanupOldStates();

  const state = crypto.randomBytes(32).toString("hex");
  oauthStateStore.set(state, {
    ...data,
    createdAt: Date.now(),
  });

  return state;
}

export function getOAuthState(state: string) {
  const data = oauthStateStore.get(state);
  if (data) {
    oauthStateStore.delete(state);
  }
  return data;
}
