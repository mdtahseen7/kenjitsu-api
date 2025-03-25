import Fastify, { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexHTML = '../../public';
export default async function StaticRoutes(fastify: FastifyInstance) {
  const publicDir = path.join(__dirname, indexHTML);

  await fastify.register(fastifyStatic, {
    root: publicDir,
    prefix: '/',
  });

  fastify.get('/', async (request, reply) => {
    return reply.sendFile('index.html');
  });
}
