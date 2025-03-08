import { AnimeKai, SubOrDub } from 'hakai-extensions';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

const animekai = new AnimeKai();

export default async function AnimekaiRoutes(fastify: FastifyInstance) {
  ///
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
      message: 'Welcome to Animekai Provider',
    });
  });

  // api/anime/animekai/search?q=string&page=number
  fastify.get('/search', async (request: FastifyRequest, reply: FastifyReply) => {
    const { q } = request.query as { q: string };
    const { page } = request.query as { page: number };

    const data = await animekai.search(q, page);
    return reply.send({ data });
  });

  //api/anime/animekai/info/:id
  fastify.get('/info/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const data = await animekai.fetchAnimeInfo(id);

    return reply.send({ data });
  });

  //api/anime/animekai/servers/:id&category=''
  fastify.get('/servers/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const { category } = request.query as { category: SubOrDub };
    const data = await animekai.fetchServers(id, category);

    return reply.send({ data });
  });

  //api/anime/animekai/sources/:id&category=''
  fastify.get('/sources/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const { category } = request.query as { category: SubOrDub };
    const data = await animekai.fetchSources(id, category);

    return reply.send({ data });
  });
}
