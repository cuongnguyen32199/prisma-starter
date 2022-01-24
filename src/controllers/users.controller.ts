import prisma from '../lib/database';

export async function create(data: { email: string }): Promise<any> {
  return prisma.user.create({ data });
}

export async function update(data: { email: string; fullname: string }): Promise<any> {
  return prisma.user.update({ where: { email: data.email }, data });
}

export async function filter(): Promise<any> {
  return prisma.user.findMany({ include: { posts: true } });
}

export async function findUnique(email: string): Promise<any> {
  return prisma.user.findUnique({ where: { email } });
}

export async function findFirst(email: string): Promise<any> {
  return prisma.user.findFirst({ where: { email } });
}

export async function batchInsert(): Promise<any> {
  const emailWithRandom = `cuongnm4215.${Math.floor(Math.random() * 100)}@gmail.com`;

  return prisma.user.create({
    data: {
      email: emailWithRandom,
      posts: {
        create: {
          title: 'From testing purpose',
        },
      },
    },
  });
}

export async function findRandomEmail(pattern: string): Promise<any> {
  return prisma.user.findMany({
    where: {
      email: {
        contains: pattern,
      },
    },
  });
}
