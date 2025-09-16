import { FlixHQ } from '@middlegear/hakai-extensions';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { FastifyParams, FastifyQuery } from '../../utils/types.js';

const flixhq = new FlixHQ();

export default async function FlixHQRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send({ message: 'Welcome to FlixHQ provider' });
  });

  fastify.get('/search', async (request: FastifyRequest<{ Querystring: FastifyQuery }>, reply: FastifyReply) => {
    reply.header('Cache-Control', 's-maxage=86400, stale-while-revalidate=300');

    let q = request.query.q?.trim() ?? '';
    q = decodeURIComponent(q);
    q = q.replace(/[^\w\s\-_.]/g, '');

    if (q.length > 1000) {
      return reply.status(400).send({ error: 'Query string too long' });
    }
    if (!q.length) {
      return reply.status(400).send({ error: 'Query string cannot be empty' });
    }

    const page = Number(request.query.page) || 1;
    const result = await flixhq.search(q, page);

    if ('error' in result) {
      return reply.status(500).send(result);
    }

    return reply.status(200).send(result);
  });

  fastify.get('/info/:mediaId', async (request: FastifyRequest<{ Params: FastifyParams }>, reply: FastifyReply) => {
    reply.header('Cache-Control', 's-maxage=43200, stale-while-revalidate=300');

    const mediaId = request.params.mediaId;

    if (!mediaId) {
      return reply.status(400).send({ error: 'Missing required params: mediaId' });
    }

    const result = await flixhq.fetchMediaInfo(mediaId);
    if ('error' in result) {
      return reply.status(500).send(result);
    }

    return reply.status(200).send(result);
  });

  fastify.get('/servers/:episodeId', async (request: FastifyRequest<{ Params: FastifyParams }>, reply: FastifyReply) => {
    reply.header('Cache-Control', 's-maxage=3600, stale-while-revalidate=300');

    const episodeId = request.params.episodeId;

    if (!episodeId) {
      return reply.status(400).send({ error: 'Missing required params: EpisodeId' });
    }
    const results = await flixhq.fetchMediaServers(episodeId);

    if ('error' in results) {
      return reply.status(500).send(results);
    }
    return reply.status(200).send(results);
  });

  fastify.get(
    '/watch/:episodeId',
    async (request: FastifyRequest<{ Params: FastifyParams; Querystring: FastifyQuery }>, reply: FastifyReply) => {
      reply.header('Cache-Control', 's-maxage=300, stale-while-revalidate=180');

      const episodeId = request.params.episodeId;
      const server = (request.query.server as 'upcloud' | 'vidcloud' | 'akcloud') || 'vidcloud';

      if (!episodeId) {
        return reply.status(400).send({ error: 'Missing required params: EpisodeId' });
      }

      const validServers = ['vidcloud', 'akcloud', 'upcloud'] as const;
      if (!validServers.includes(server)) {
        return reply.status(400).send({
          error: `Invalid server: '${server}'. Expected one of ${validServers.join(', ')}.`,
        });
      }
      const results = await flixhq.fetchSources(episodeId, server);

      if ('error' in results) {
        return reply.status(500).send(results);
      }
      return reply.status(200).send(results);
    },
  );
}
