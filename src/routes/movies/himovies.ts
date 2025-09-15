import { Himovies } from '@middlegear/hakai-extensions';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { FastifyParams, FastifyQuery } from '../../utils/types.js';
import { SearchType, toSearchType } from '../../utils/utils.js';

const himovies = new Himovies();

export default async function HimoviesRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.header('Cache-Control', `s-maxage=${1 * 60 * 60}, stale-while-revalidate=300`);
    const result = await himovies.fetchHome();

    if ('error' in result) {
      return reply.status(500).send({
        trending: result.trending,
        recentReleases: result.recentReleases,
        upcoming: result.upcoming,
        error: result.error,
      });
    }

    return reply.status(200).send({
      trending: result.trending,
      recentReleases: result.recentReleases,
      upcoming: result.upcoming,
    });
  });

  fastify.get('/search', async (request: FastifyRequest<{ Querystring: FastifyQuery }>, reply: FastifyReply) => {
    reply.header('Cache-Control', `s-maxage=${148 * 60 * 60}, stale-while-revalidate=300`);

    let q = request.query.q?.trim() ?? '';
    q = decodeURIComponent(q);
    q = q.replace(/[^\w\s\-_.]/g, '');

    if (!q.length) {
      return reply.status(400).send({ error: 'Query string cannot be empty' });
    }
    if (q.length > 1000) {
      return reply.status(400).send({ error: 'Query too long' });
    }

    const page = Number(request.query.page) || 1;
    const result = await himovies.search(q, page);

    if ('error' in result) {
      return reply.status(500).send({
        hasNextPage: result.hasNextPage,
        currentPage: result.currentPage,
        lastPage: result.lastPage,
        data: result.data,
        error: result.error,
      });
    }
    return reply.status(200).send({
      hasNextPage: result.hasNextPage,
      currentPage: result.currentPage,
      lastPage: result.lastPage,
      data: result.data,
    });
  });

  fastify.get('/suggestions', async (request: FastifyRequest<{ Querystring: FastifyQuery }>, reply: FastifyReply) => {
    reply.header('Cache-Control', `s-maxage=${148 * 60 * 60}, stale-while-revalidate=300`);

    let q = request.query.q?.trim() ?? '';
    q = decodeURIComponent(q);
    q = q.replace(/[^\w\s\-_.]/g, '');

    if (!q.length) {
      return reply.status(400).send({ error: 'Query string cannot be empty' });
    }
    if (q.length > 1000) {
      return reply.status(400).send({ error: 'Query too long' });
    }

    const result = await himovies.searchSuggestions(q);

    if ('error' in result) {
      return reply.status(500).send({
        data: result.data,
        error: result.error,
      });
    }
    return reply.status(200).send({
      data: result.data,
    });
  });

  //// needs fixing
  fastify.get('/advancedsearch', async (request: FastifyRequest<{ Querystring: FastifyQuery }>, reply: FastifyReply) => {
    reply.header('Cache-Control', `s-maxage=${148 * 60 * 60}, stale-while-revalidate=300`);

    const type = 'all';

    const page = Number(request.query.page) || 1;
    const result = await himovies.advancedSearch(type);

    if ('error' in result) {
      return reply.status(500).send({
        hasNextPage: result.hasNextPage,
        currentPage: result.currentPage,
        lastPage: result.lastPage,
        data: result.data,
        error: result.error,
      });
    }
    return reply.status(200).send({
      hasNextPage: result.hasNextPage,
      currentPage: result.currentPage,
      lastPage: result.lastPage,
      data: result.data,
    });
  });

  fastify.get(
    '/info/:mediaId',
    async (request: FastifyRequest<{ Querystring: FastifyQuery; Params: FastifyParams }>, reply: FastifyReply) => {
      reply.header('Cache-Control', `s-maxage=${148 * 60 * 60}, stale-while-revalidate=300`);

      const mediaId = String(request.params.mediaId);
      const result = await himovies.fetchMediaInfo(mediaId);

      if ('error' in result) {
        return reply.status(500).send({
          data: result.data,
          recommended: result.recommended,
          providerEpisodes: result.providerEpisodes,
          error: result.error,
        });
      }
      return reply.status(200).send({
        data: result.data,
        recommended: result.recommended,
        providerEpisodes: result.providerEpisodes,
      });
    },
  );

  fastify.get('/popular', async (request: FastifyRequest<{ Querystring: FastifyQuery }>, reply: FastifyReply) => {
    const type = String(request.query.type);
    if (!type) {
      return reply.status(400).send({
        error: "Missing required parameter: 'type' cannot be undefined.",
      });
    }
    const page = Number(request.query.page) || 1;
    const validateType = toSearchType(type);

    reply.header('Cache-Control', `s-maxage=${24 * 60 * 60}, stale-while-revalidate=300`);

    let result;
    validateType === SearchType.Movie
      ? (result = await himovies.fetchPopularMovies(page))
      : (result = await himovies.fetchPopularTv(page));

    if ('error' in result) {
      return reply.status(500).send({
        hasNextPage: result.hasNextPage,
        currentPage: result.currentPage,
        lastPage: result.lastPage,
        data: result.data,
        error: result.error,
      });
    }

    return reply.status(200).send({
      hasNextPage: result.hasNextPage,
      currentPage: result.currentPage,
      lastPage: result.lastPage,
      data: result.data,
    });
  });
}
