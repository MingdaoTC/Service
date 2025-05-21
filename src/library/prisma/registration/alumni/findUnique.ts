import { prisma } from "@/library/prisma";
import { AlumniRegistration } from "@/prisma/client";

export async function findUniqueAlumniRegistration(
  param: Partial<AlumniRegistration>,
) {
  if (!param.id) {
    throw new Error("At least one parameter should be provided.");
  }

  return await prisma.alumniRegistration.findUnique({
    where: {
      id: param.id,
    },
  });
}
