import { prisma } from "@/library/prisma";

export async function findManyJobCategory() {
  return await prisma.jobCategory.findMany();
}
