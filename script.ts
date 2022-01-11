import fs from 'fs';
import path from 'path';
import { EOL } from 'os';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'info' },
    { emit: 'stdout', level: 'warn' },
    { emit: 'stdout', level: 'error' }
  ]
});

const LOG_FILE = 'database.log';
const LOG_PATH = path.join(process.cwd(), LOG_FILE);

prisma.$on('query', async (e) => {
  const query = e.query + ' - Duration: ' + e.duration + 'ms' + EOL;

  fs.appendFileSync(LOG_PATH, query);
});

async function main() {
  const users = await prisma.user.findMany({ include: { posts: true } });

  console.dir(users, { depth: null });
}

main()
  .catch((e) => console.log(e.toString()))
  .finally(async () => await prisma.$disconnect());
