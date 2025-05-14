import { prisma } from "@/library/prisma";
import { CompanyRegistration } from "@/prisma/client";

export async function findManyCompanyRegistration(
  param: Partial<CompanyRegistration>
) {
  if (!param.email) {
    throw new Error("At least one parameter should be provided.");
  }

  return await prisma.companyRegistration.findMany({
    where: {
      email: param.email,
    },
  });
}
