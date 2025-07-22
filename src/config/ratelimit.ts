import 'dotenv/config';

export const rateLimitPlugIn = import('@fastify/rate-limit');
export const ratelimitOptions = {
  timeWindow: Number(process.env.WINDOW_IN_MS) || 1000,
  max: Number(process.env.MAX_API_REQUESTS) || 6,
  global: true,
  ban: 1,
};
