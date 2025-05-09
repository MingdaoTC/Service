import { prisma } from "@/library/db/prisma";

import { Application } from "@/prisma/client";

export async function createApplication(newData: Application) {
  const application = await prisma.application.create({
    data: newData,
  });
  return application;
}
