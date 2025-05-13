import { prisma } from "@/library/prisma";
import { CompanyRegistration } from "@/prisma/client";

export async function createCompanyRegistration(data: CompanyRegistration) {
  return await prisma.companyRegistration.create({
    data: data,
  });
}
