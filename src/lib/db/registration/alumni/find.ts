import { prisma } from "@/lib/db/prisma";

export type findAlumniRegistrationTypes = {
  id?: string;
  email?: string;
};

export async function findAlumniRegistration(
  param: findAlumniRegistrationTypes,
) {
  if (!param.id && !param.email) {
    throw new Error("At least one parameter should be provided.");
  }

  return await prisma.alumniRegistration.findUnique({
    where: {
      id: param.id,
      email: param.email,
    },
  });
}
