import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import AnilistRoutes from './anilist.js';
import JikanRoutes from './jikan.js';

export default async function MetaRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
      message: 'Welcome to Meta Provider',
    });
  });

  fastify.register(AnilistRoutes, { prefix: '/anilist' });
  fastify.register(JikanRoutes, { prefix: '/jikan' });
}
