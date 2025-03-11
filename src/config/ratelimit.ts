/// here is where i will define options for rate limit
import 'dotenv/config';
export const ratelimitPlugin = import('@fastify/rate-limit');

export const ratelimitOptions = {
  timeWindow: Number(process.env.WINDOW_IN_MS) || 1000,
  max: Number(process.env.MAX_API_REQUESTS) || 6,
};
