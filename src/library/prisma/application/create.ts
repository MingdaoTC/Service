import { prisma } from "@/library/prisma";
import { Application } from "@/prisma/client";

export async function createApplication(data: Application) {
  return await prisma.application.create({
    data: data,
  });
}
