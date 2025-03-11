import 'dotenv';
import { Redis } from 'ioredis';

const port = process.env.REDIS_PORT;
const host = process.env.REDIS_HOST;
const password = process.env.REDIS_PASSWORD;

export const redis = new Redis({
  host: host,
  password: password,
  port: Number(port),
  tls: {},
});

async function checkRedis() {
  try {
    const pong = await redis.ping();
    console.log('✅ Redis Connection Successful:', pong);
  } catch (err) {
    console.error('❌ Redis Connection Failed:', err);
  }
}

// checkRedis();
