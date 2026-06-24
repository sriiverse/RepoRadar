// Simple in-memory cache for API responses
// Will be upgraded to Vercel KV on deployment

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCached(key: string, value: unknown, ttlSeconds = 3600): void {
  cache.set(key, {
    data: value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export function clearCache(key: string): void {
  cache.delete(key);
}
