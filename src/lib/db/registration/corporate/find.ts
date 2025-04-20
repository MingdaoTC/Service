import { prisma } from "@/lib/db/prisma";

export type findCorporateRegistrationTypes = {
  id?: string;
  email?: string;
};

export async function findCorporateRegistration(param: findCorporateRegistrationTypes) {
  if (!param.id && !param.email) {
    throw new Error("At least one parameter should be provided.");
  }

  return await prisma.corporateRegistration.findUnique({
    where: {
      id: param.id,
      email: param.email,
    },
  });
}
