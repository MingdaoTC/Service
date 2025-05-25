import { prisma } from "@/library/prisma";
import { Prisma } from "@/prisma/client";

export async function createApplication(data: Prisma.ApplicationCreateInput) {
  return await prisma.application.create({
    data: data,
  });
}
