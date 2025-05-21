import { prisma } from "@/library/prisma";
import { Company } from "@/prisma/client";

export async function createCompany(data: Company) {
  return await prisma.company.create({
    data: data,
  });
}
