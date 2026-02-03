import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Initialize Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiters for different use cases
export const rateLimiters = {
  // API rate limiter - 100 requests per minute
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 m"),
    analytics: true,
    prefix: "ratelimit:api",
  }),

  // AI requests - 20 per minute (expensive operations)
  ai: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 m"),
    analytics: true,
    prefix: "ratelimit:ai",
  }),

  // Workflow runs - 10 per minute
  workflow: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
    prefix: "ratelimit:workflow",
  }),

  // Auth attempts - 5 per minute
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
    prefix: "ratelimit:auth",
  }),
};

// Cache utilities
export const cache = {
  // Get cached value
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    return value as T | null;
  },

  // Set cached value with TTL (in seconds)
  async set<T>(key: string, value: T, ttlSeconds: number = 300): Promise<void> {
    await redis.set(key, value, { ex: ttlSeconds });
  },

  // Delete cached value
  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  // Delete all cached values matching a pattern
  async delPattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  },

  // Get or set cached value (cache-aside pattern)
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds: number = 300
  ): Promise<T> {
    const cached = await cache.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fetcher();
    await cache.set(key, value, ttlSeconds);
    return value;
  },
};

// Cache key generators
export const cacheKeys = {
  // User's workspaces
  userWorkspaces: (userId: string) => `user:${userId}:workspaces`,

  // Workspace data
  workspace: (workspaceId: string) => `workspace:${workspaceId}`,

  // Brand data
  brand: (brandId: string) => `brand:${brandId}`,

  // Workflow data
  workflow: (workflowId: string) => `workflow:${workflowId}`,

  // Report data
  report: (reportId: string) => `report:${reportId}`,

  // Connection data
  connection: (connectionId: string) => `connection:${connectionId}`,

  // Google API data cache
  googleAdsData: (connectionId: string, dateRange: string) =>
    `google:ads:${connectionId}:${dateRange}`,
  googleAnalyticsData: (connectionId: string, dateRange: string) =>
    `google:analytics:${connectionId}:${dateRange}`,
  searchConsoleData: (connectionId: string, dateRange: string) =>
    `google:search:${connectionId}:${dateRange}`,
};

// Invalidate cache for entity updates
export const invalidateCache = {
  async workspace(workspaceId: string): Promise<void> {
    await cache.del(cacheKeys.workspace(workspaceId));
  },

  async brand(brandId: string): Promise<void> {
    await cache.del(cacheKeys.brand(brandId));
  },

  async workflow(workflowId: string): Promise<void> {
    await cache.del(cacheKeys.workflow(workflowId));
  },

  async connection(connectionId: string): Promise<void> {
    await cache.del(cacheKeys.connection(connectionId));
    // Also invalidate related Google API data
    await cache.delPattern(`google:*:${connectionId}:*`);
  },

  async userWorkspaces(userId: string): Promise<void> {
    await cache.del(cacheKeys.userWorkspaces(userId));
  },
};
