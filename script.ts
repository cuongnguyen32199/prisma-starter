import casual from 'casual';
import prisma from './src/lib/database';
import * as usersController from './src/controllers/users.controller';

async function seed(truncate: boolean = false) {
  if (truncate) {
    await prisma.$executeRaw`DELETE FROM "main"."User"`;
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name="User"`;
  }

  const seeds = Array.from({ length: 1000 }).map(() => ({
    email: casual.email,
    fullname: casual.name,
  }));

  const transactions = seeds.map((user) => prisma.user.create({ data: user }));
  const response = await prisma.$transaction(transactions);

  return response;
}

async function main() {
  await seed(true);
  console.log('Seeding done...');
}

main()
  .catch((e) => console.log(e.toString()))
  .finally(async () => await prisma.$disconnect());
