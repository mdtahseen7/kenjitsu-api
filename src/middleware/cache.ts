import { redis } from '../config/redis.js';
import snappy from 'snappy';
import 'dotenv';

const COMPRESSION_THRESHOLD = 1024; // Compress if data is larger than 1KB
const MEMORY_CACHE_ENABLED = true; // Enable in-memory caching
const memoryCache = new Map<string, any>(); // In-memory cache
const DEFAULT_CACHE_EXPIRY_HOURS = 1;
const CACHE_ENABLED = process.env.CACHE_ENABLED === 'false'; // Caching is optional

/**
 * Compresses data using Snappy if it exceeds the threshold.
 */
async function compressData(data: string): Promise<Buffer | string> {
  if (data.length > COMPRESSION_THRESHOLD) {
    const compressed = await snappy.compress(Buffer.from(data));
    console.log('Data compressed successfully');
    return compressed;
  }
  return data;
}

/**
 * Decompresses data using Snappy if it is compressed.
 */
async function decompressData(data: Buffer | string): Promise<string> {
  try {
    if (data instanceof Buffer) {
      const decompressed = await snappy.uncompress(data, { asBuffer: false });
      console.log('Data decompressed successfully');
      return decompressed.toString();
    }
    return data as string;
  } catch (error) {
    console.error('Decompression failed:', error);
    throw new Error('Invalid or corrupted compressed data');
  }
}

/**
 * Sets a value in Redis cache with optional TTL.
 */
async function redisSetCache(key: string, value: any, ttlInHours: number = DEFAULT_CACHE_EXPIRY_HOURS): Promise<void> {
  if (!CACHE_ENABLED) return; // Exit if caching is disabled

  try {
    const stringValue = JSON.stringify(value);
    const dataToStore = await compressData(stringValue);

    if (!(dataToStore instanceof Buffer || typeof dataToStore === 'string')) {
      console.error('Invalid data type for Redis:', typeof dataToStore);
      return;
    }

    await redis.set(key, dataToStore, 'EX', ttlInHours * 3600);

    console.log(`Data stored in Redis (Key: ${key})`);

    if (MEMORY_CACHE_ENABLED) {
      memoryCache.delete(key);
    }
  } catch (error) {
    console.error('Error setting Redis cache:', error);
  }
}

/**
 * Retrieves a value from Redis cache.
 */
async function redisGetCache(key: string): Promise<any | null> {
  if (!CACHE_ENABLED) return null; // Exit if caching is disabled

  try {
    if (MEMORY_CACHE_ENABLED && memoryCache.has(key)) {
      console.log(`Cache hit (Memory) - Key: ${key}`);
      return memoryCache.get(key);
    }

    const data = await redis.getBuffer(key);
    if (!data) {
      console.log(`Cache miss (Redis) - Key: ${key}`);
      return null;
    }

    let decompressedData;
    try {
      decompressedData = await decompressData(data);
    } catch (error) {
      console.error('Assuming uncompressed data:', error);
      decompressedData = data.toString();
    }

    const value = JSON.parse(decompressedData);

    if (MEMORY_CACHE_ENABLED) {
      memoryCache.set(key, value);
    }

    console.log(`Cache hit (Redis) - Key: ${key}`);
    return value;
  } catch (error) {
    console.error('Error getting Redis cache:', error);
    return null;
  }
}

/**
 * Purges a specific key or the entire cache.
 * @param key - Optional cache key to remove. If not provided, clears all caches.
 */
async function redisPurgeCache(key?: string): Promise<void> {
  if (!CACHE_ENABLED) return; // Exit if caching is disabled

  try {
    if (key) {
      await redis.del(key);
      memoryCache.delete(key);
      console.log(`Cache cleared for key: ${key}`);
    } else {
      await redis.flushall(); // Clears all Redis keys
      memoryCache.clear(); // Clears in-memory cache
      console.log('Entire cache has been purged');
    }
  } catch (error) {
    console.error('Error purging cache:', error);
  }
}

/**
 * @param expiryHours set to 1 by default
 */
async function redisGetOrSetCache<T>(
  setCB: () => Promise<T>,
  key: string,
  expiryHours: number = DEFAULT_CACHE_EXPIRY_HOURS,
): Promise<T> {
  if (!CACHE_ENABLED) return setCB(); // Exit if caching is disabled and return the result of setCB

  const cachedData = await redisGetCache(key);
  let data = cachedData as T;

  if (!data) {
    data = await setCB();
    await redisSetCache(key, data, expiryHours);
  }
  return data;
}

// Export functions
export { redisSetCache, redisGetCache, redisPurgeCache, redisGetOrSetCache };
