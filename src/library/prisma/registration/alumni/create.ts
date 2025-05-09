import { prisma } from "@/library/prisma";
import { AlumniRegistration } from "@/prisma/client";

export async function createAlumniRegistration(newData: AlumniRegistration) {
  return await prisma.alumniRegistration.create({
    data: newData,
  });
}
