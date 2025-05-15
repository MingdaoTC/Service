import { prisma } from "@/library/prisma";

export async function findManyCompanyCategory() {
  return await prisma.companyCategory.findMany();
}
