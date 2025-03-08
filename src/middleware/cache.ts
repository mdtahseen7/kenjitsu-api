import { Redis } from 'ioredis';

const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
});

async function redisSetCache(key: string, value: any, ttlInHours?: number): Promise<void> {
  if (ttlInHours) {
    const ttlInSeconds = ttlInHours * 3600;

    await redis.set(key, JSON.stringify(value), 'EX', ttlInSeconds);
  } else {
    await redis.set(key, JSON.stringify(value));
  }
}

async function redisGetCache(key: string): Promise<any | null> {
  const data = await redis.get(key);
  if (data) {
    return JSON.parse(data);
  }
  return null;
}

export { redisGetCache, redisSetCache };
