import fs from 'fs';
import path from 'path';
import { EOL } from 'os';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' },
    { emit: 'event', level: 'error' },
  ],
});

const LOG_FILE = 'database.log';
const ERROR_LOG_FILE = 'error.log';
const LOG_PATH = path.join(process.cwd(), LOG_FILE);
const ERROR_LOG_PATH = path.join(process.cwd(), ERROR_LOG_FILE);

prisma.$on('query', async (e) => {
  const date = new Date(e.timestamp).toLocaleString();
  const query = `QUERY: ${date} | ${e.query} - Duration: ${e.duration}ms ${EOL}`;

  fs.appendFileSync(LOG_PATH, query);
});

prisma.$on('warn', async (e) => {
  const date = new Date(e.timestamp).toLocaleString();
  const log = `WARN: ${date} | ${e.message} ${EOL}`;

  fs.appendFileSync(ERROR_LOG_PATH, log);
});

prisma.$on('error', async (e) => {
  const date = new Date(e.timestamp).toLocaleString();
  const log = `ERROR: ${date} | ${e.message} ${EOL}`;

  fs.appendFileSync(ERROR_LOG_PATH, log);
});

export default prisma;
