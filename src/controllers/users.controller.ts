import prisma from '../lib/database';

export async function create(data: { email: string }): Promise<any> {
  return prisma.user.create({ data });
}

export async function update(data: { email: string; fullname: string }): Promise<any> {
  return prisma.user.update({ where: { email: data.email }, data });
}

export async function filter(): Promise<any> {
  return prisma.user.findMany();
}
