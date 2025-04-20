import { prisma } from "@/lib/db/prisma";

import { AlumniRegistration } from "@/prisma/client";

export async function createAlumniRegistration(newData: AlumniRegistration) {
  const registration = await prisma.alumniRegistration.create({
    data: newData,
  });
  return registration;
}
