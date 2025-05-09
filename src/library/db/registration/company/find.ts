import { prisma } from "@/library/db/prisma";

export type findCompanyRegistrationTypes = {
  id?: string;
  email?: string;
};

export async function findCompanyRegistration(
  param: findCompanyRegistrationTypes,
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
