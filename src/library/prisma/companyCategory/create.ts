import { prisma } from "@/library/prisma";
import { CompanyCategory } from "@/prisma/client";

export async function createCompanyCategory(data: CompanyCategory) {
  return await prisma.companyCategory.create({
    data: data,
  });
}
