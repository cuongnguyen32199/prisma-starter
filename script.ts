import fs from 'fs';
import path from 'path';
import casual from 'casual';

import prisma from './src/lib/database';
import * as usersController from './src/controllers/users.controller';

export async function seedUsers(truncate: boolean = false) {
  if (truncate) {
    await prisma.$executeRaw`DELETE FROM "main"."User"`;
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name="User"`;
  }

  const seedPath = path.join(process.cwd(), '__mocks__', 'users.json');
  const seeds = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

  const transactions = (seeds as any).map((user: any) => prisma.user.create({ data: user }));
  await prisma.$transaction(transactions);
  console.log('----------USERS INSERTED----------');
}

export async function seed(truncate: boolean = false) {
  await seedUsers(truncate);
}

export async function genSeedData() {
  const users = Array.from({ length: 1000 }).map(() => ({
    email: casual.email,
    fullname: casual.name,
  }));

  const seedPath = path.join(process.cwd(), '__mocks__', 'users.json');

  await fs.writeFileSync(seedPath, JSON.stringify(users));
  console.log('----------GENERATED USERS SEED DATA----------');
}

async function main() {
  // await genSeedData();
  // await seed(true);
  // await usersController.filter();
  // await usersController.findUnique('Predovic_Merle@Bernardo.us');
  // await usersController.findFirst('Predovic_Merle@Bernardo.us');
  // await usersController.batchInsert();
  // const users = await usersController.findRandomEmail('cuongnm4215');
}

main()
  .catch((e) => console.log(e.toString()))
  .finally(async () => await prisma.$disconnect());
