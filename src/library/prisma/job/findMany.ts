import { prisma } from "@/library/prisma";

export async function findManyJob() {
  return await prisma.job.findMany();
}
