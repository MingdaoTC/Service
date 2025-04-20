import { prisma } from "@/lib/db/prisma";

import { CorporateRegistration } from "@/prisma/client";

export async function createUser(newData: CorporateRegistration) {
  const registration = await prisma.corporateRegistration.create({
    data: newData,
  });
  return registration;
}
