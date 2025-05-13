import { prisma } from "@/library/prisma";
import { CompanyRegistration } from "@/prisma/client";

export async function findUniqueCompanyRegistration(
  param: Partial<CompanyRegistration>
) {
  if (!param.id && !param.email) {
    throw new Error("At least one parameter should be provided.");
  }

  return await prisma.companyRegistration.findUnique({
    where: {
      id: param.id,
      email: param.email,
    },
  });
}
