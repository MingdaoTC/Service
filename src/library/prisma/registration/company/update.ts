import { prisma } from "@/library/prisma";
import { CompanyRegistration } from "@/prisma/client";

export async function updateCompanyRegistration(
  param: Partial<CompanyRegistration>,
  data: Partial<CompanyRegistration>,
) {
  if (!param.id && !param.email) {
    throw new Error("At least one parameter should be provided.");
  }

  if (!data) {
    throw new Error("No data to update.");
  }

  return await prisma.companyRegistration.update({
    where: {
      id: param.id,
      email: param.email,
    },
    data: data,
  });
}
