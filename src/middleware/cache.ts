import { redis } from '../config/redis.js'; // Redis is optional
import 'dotenv';

const MEMORY_CACHE_ENABLED = process.env.MEMORY_CACHE_ENABLED === 'true'; // Enable in-memory caching
const DEFAULT_CACHE_EXPIRY_HOURS = 1;

const MEMORY_CACHE_TTL_MS = 30 * 60 * 1000; // Default: 30 minutes
const MEMORY_CACHE_TTL =
  process.env.MEMORY_CACHE_TTL_MINUTES && !isNaN(Number(process.env.MEMORY_CACHE_TTL_MINUTES))
    ? Number(process.env.MEMORY_CACHE_TTL_MINUTES) * 60 * 1000
    : MEMORY_CACHE_TTL_MS;

const memoryCache = new Map<string, { value: any; timestamp: number }>();

if (MEMORY_CACHE_ENABLED) {
  console.log('🚀 Memory Caching Enabled: Doesnt work on serverless environment');
  console.log(`Memory caching TTL is ${(MEMORY_CACHE_TTL / 60000).toFixed(1)} minutes`);
} else {
  console.log('❌ Memory Caching Disabled');
}

/**
 * Cleans up expired entries from the memory cache.
 */
function cleanUpMemoryCache() {
  const now = Date.now();
  for (const [key, entry] of memoryCache.entries()) {
    if (now - entry.timestamp > MEMORY_CACHE_TTL) {
      memoryCache.delete(key);
      console.log(`Memory cache expired and deleted (Key: ${key})`);
    }
  }
}
setInterval(cleanUpMemoryCache, MEMORY_CACHE_TTL);

/**
 * Sets a value in the cache (Redis and/or in-memory).
 */
async function redisSetCache<T>(key: string, value: T, ttlInHours: number = DEFAULT_CACHE_EXPIRY_HOURS): Promise<void> {
  const stringValue = JSON.stringify(value);

  if (redis) {
    await redis.set(key, stringValue, 'EX', ttlInHours * 3600);
    console.log(`Data stored in Redis (Key: ${key})`);
  }

  if (MEMORY_CACHE_ENABLED) {
    memoryCache.set(key, { value, timestamp: Date.now() });
    console.log(`Data stored in memory cache (Key: ${key})`);
  }
}

/**
 * Retrieves a value from the cache (Redis and/or in-memory).
 */
async function redisGetCache<T>(key: string): Promise<T | null> {
  if (MEMORY_CACHE_ENABLED && memoryCache.has(key)) {
    const cacheEntry = memoryCache.get(key)!;
    if (Date.now() - cacheEntry.timestamp <= MEMORY_CACHE_TTL_MS) {
      console.log(`Cache hit (Memory) - Key: ${key}`);
      return cacheEntry.value as T;
    } else {
      memoryCache.delete(key);
    }
  }

  if (redis) {
    const data = await redis.get(key);
    if (data) {
      try {
        const value = JSON.parse(data) as T;
        console.log(`Cache hit (Redis) - Key: ${key}`);
        if (MEMORY_CACHE_ENABLED) {
          memoryCache.set(key, { value, timestamp: Date.now() });
        }
        return value;
      } catch (error) {
        console.error('Error parsing JSON from Redis:', error);
        return null;
      }
    }
  }
  if (redis || MEMORY_CACHE_ENABLED) {
    console.log(`Cache miss - Key: ${key}`);
  }
  return null;
}

/**
 * Purges a specific key or the entire cache (Redis and/or in-memory).
 */
async function purgeCache(key?: string): Promise<void> {
  if (redis) {
    if (key) {
      await redis.del(key);
      console.log(`Redis cache cleared for key: ${key}`);
    } else {
      await redis.flushall();
      console.log('Entire Redis cache has been purged');
    }
  }

  if (MEMORY_CACHE_ENABLED) {
    if (key) {
      memoryCache.delete(key);
      console.log(`Memory cache cleared for key: ${key}`);
    } else {
      memoryCache.clear();
      console.log('Entire memory cache has been purged');
    }
  }
}

export { redisGetCache, redisSetCache, purgeCache };
