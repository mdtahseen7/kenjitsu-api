import AnimekaiRoutes from './animekai.js';
import HianimeRoutes from './hianime.js';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default async function AnimeRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
      message: 'Welcome to AnimeRoutes Provider',
    });
  });
  fastify.register(AnimekaiRoutes, { prefix: '/animekai' });
  fastify.register(HianimeRoutes, { prefix: '/hianime' });
}
