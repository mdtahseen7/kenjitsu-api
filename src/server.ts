import 'dotenv/config';
import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import MetaRoutes from './routes/meta/index.js';
import AnimeRoutes from './routes/anime/index.js';
import { ratelimitPlugin } from './config/ratelimit.js';

const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname,reqId',
        colorize: true,
      },
    },
  },
  disableRequestLogging: true,
});

//
fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
  reply.status(200).send({ message: 'Avalaible routes are /anime & /meta' }); // remeber to add html picture for the root api
});
//api/meta route
fastify.register(MetaRoutes, { prefix: 'api/meta' });
//api/anime route
fastify.register(AnimeRoutes, { prefix: '/api/anime' });

await fastify.register(ratelimitPlugin, { global: true, max: 4, timeWindow: 2000, ban: 20 });
fastify.setNotFoundHandler(
  {
    preHandler: fastify.rateLimit(),
  },
  function (request, reply) {
    reply.code(404).send({ hello: 'world' });
  },
);
declare module 'fastify' {
  interface FastifyRequest {
    startTime?: [number, number];
  }
}

fastify.addHook('onRequest', (request: FastifyRequest, reply: FastifyReply, done) => {
  request.startTime = process.hrtime();
  request.log.info(`Incoming: ${request.method} ${request.url} | IP: ${request.ip}`);
  done();
});

fastify.addHook('onResponse', (request: FastifyRequest, reply: FastifyReply, done) => {
  if (request.startTime) {
    const diff = process.hrtime(request.startTime);
    const responseTimeMs = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2); // Convert to ms

    request.log.info(
      `Completed: ${request.method} ${request.url} | ${reply.statusCode} | ${responseTimeMs}ms | IP: ${request.ip}`,
    );
  }
  done();
});
// redisPurgeCache();

async function start() {
  try {
    const port = parseInt(process.env.PORT || '3000', 10);
    const host = process.env.HOSTNAME || '127.0.0.1';

    if (isNaN(port)) {
      fastify.log.error('Invalid PORT environment variable');
      process.exit(1);
    }

    await fastify.listen({ host, port });
  } catch (err) {
    fastify.log.error(`Server startup error: ${err}`);
    process.exit(1);
  }
}

start();
