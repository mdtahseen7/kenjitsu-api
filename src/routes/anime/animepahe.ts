import { Animepahe } from '@middlegear/hakai-extensions';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { FastifyQuery, FastifyParams } from '../../utils/types.js';

const animepahe = new Animepahe();

export default function AnimepaheRoutes(fastify: FastifyInstance) {
  fastify.get('/search', async (request: FastifyRequest<{ Querystring: FastifyQuery }>, reply: FastifyReply) => {
    reply.header('Cache-Control', 's-maxage=86400, stale-while-revalidate=300');
    let q = request.query.q?.trim() ?? '';
    q = decodeURIComponent(q);
    q = q.replace(/[^\w\s\-_.]/g, '');

    if (q.length > 1000) {
      return reply.status(400).send({ error: 'Query too long' });
    }
    if (!q.length) {
      return reply.status(400).send({ error: 'Query string cannot be empty' });
    }

    const result = await animepahe.search(q);

    if ('error' in result) {
      return reply.status(500).send(result);
    }

    return reply.status(200).send(result);
  });

  fastify.get('/info/:animeId', async (request: FastifyRequest<{ Params: FastifyParams }>, reply: FastifyReply) => {
    reply.header('Cache-Control', `s-maxage=${1 * 60 * 60}, stale-while-revalidate=300`);

    const animeId = request.params.animeId;

    if (!animeId) {
      return reply.status(400).send({
        error: `Missing required path paramater: 'animeId'`,
      });
    }

    const result = await animepahe.fetchAnimeInfo(animeId);
    if ('error' in result) {
      return reply.status(500).send(result);
    }

    return reply.status(200).send(result);
  });

  fastify.get('/episodes/:animeId', async (request: FastifyRequest<{ Params: FastifyParams }>, reply: FastifyReply) => {
    reply.header('Cache-Control', `s-maxage=${1 * 60 * 60}, stale-while-revalidate=300`);

    const animeId = request.params.animeId;

    if (!animeId) {
      return reply.status(400).send({
        error: `Missing required path paramater: 'animeId'`,
      });
    }

    const result = await animepahe.fetchEpisodes(animeId);
    if ('error' in result) {
      return reply.status(500).send(result);
    }

    return reply.status(200).send(result);
  });

  fastify.get('/servers/:episodeId', async (request: FastifyRequest<{ Params: FastifyParams }>, reply: FastifyReply) => {
    reply.header('Cache-Control', `s-maxage=${1 * 60 * 60}, stale-while-revalidate=300`);

    const episodeId = request.params.episodeId;

    if (!episodeId) {
      return reply.status(400).send({
        error: `Missing required path paramater: 'episodeId'`,
      });
    }

    const result = await animepahe.fetchServers(episodeId);
    if ('error' in result) {
      return reply.status(500).send(result);
    }

    return reply.status(200).send(result);
  });

  fastify.get(
    '/watch/:episodeId',
    async (request: FastifyRequest<{ Querystring: FastifyQuery; Params: FastifyParams }>, reply: FastifyReply) => {
      reply.header('Cache-Control', `s-maxage=${0.5 * 60 * 60}, stale-while-revalidate=300`);

      const episodeId = request.params.episodeId;

      const category = (request.query.category as 'sub' | 'dub' | 'raw') || 'sub';

      if (!episodeId) {
        return reply.status(400).send({
          error: `Missing required path paramater: 'episodeId'`,
        });
      }

      const result = await animepahe.fetchSources(episodeId, category);
      if ('error' in result) {
        return reply.status(500).send(result);
      }

      return reply.status(200).send(result);
    },
  );
}
