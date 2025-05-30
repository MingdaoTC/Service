import { prisma } from "@/library/prisma";

export async function findManyUser() {
  return prisma.user.findMany();
}
