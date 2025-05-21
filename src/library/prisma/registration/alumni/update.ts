import { prisma } from "@/library/prisma";
import { AlumniRegistration } from "@/prisma/client";

export async function updateAlumniRegistration(
  param: Partial<AlumniRegistration>,
  data: Partial<AlumniRegistration>,
) {
  if (!param.id && !param.email) {
    throw new Error("At least one parameter should be provided.");
  }

  if (!data) {
    throw new Error("No data to update.");
  }

  return await prisma.alumniRegistration.update({
    where: {
      id: param.id,
      email: param.email,
    },
    data: data,
  });
}
