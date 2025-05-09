import { prisma } from "@/library/db/prisma";

import { CompanyRegistration } from "@/prisma/client";

export async function createCompanyRegistration(newData: CompanyRegistration) {
  const registration = await prisma.companyRegistration.create({
    data: newData,
  });
  return registration;
}
