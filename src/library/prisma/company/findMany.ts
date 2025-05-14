import { prisma } from "@/library/prisma";

export async function findManyCompany() {
  return await prisma.company.findMany();
}
