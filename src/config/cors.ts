import Fastify from 'fastify';
import 'dotenv';
import cors from '@fastify/cors';

const allowedOrigins = process.env.ALLOWED_ORIGINS;
const fastify = Fastify();
