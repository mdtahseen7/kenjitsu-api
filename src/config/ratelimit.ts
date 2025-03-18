import 'dotenv/config';
export const ratelimitPlugin = await import('@fastify/rate-limit');

export const ratelimitOptions = {
  timeWindow: Number(process.env.WINDOW_IN_MS) || 1000,
  max: Number(process.env.MAX_API_REQUESTS) || 6,
  global: true,
};

export const notFoundRateLimiter = {
  max: 10,
  timeWindow: 1200000,
  ban: 5,
  global: true,
};
