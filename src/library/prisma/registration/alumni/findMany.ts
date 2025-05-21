import { prisma } from "@/library/prisma";
import { AlumniRegistration } from "@/prisma/client";

export async function findManyAlumniRegistration(
  param: Partial<AlumniRegistration>,
) {
  if (!param.email) {
    throw new Error("At least one parameter should be provided.");
  }

  return await prisma.alumniRegistration.findMany({
    where: {
      email: param.email,
    },
  });
}
