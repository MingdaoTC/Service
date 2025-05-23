import { prisma } from "@/library/prisma";
import { Job } from "@/prisma/client";

export async function findUniqueJob(param: Partial<Job>) {
  if (!param.id) {
    throw new Error("At least one parameter should be provided.");
  }

  return await prisma.job.findUnique({
    where: {
      id: param.id,
    },
  });
}

export async function findUniqueJobWithPublished(param: Partial<Job>) {
  if (!param.id) {
    throw new Error("At least one parameter should be provided.");
  }

  return await prisma.job.findUnique({
    where: {
      id: param.id,
      published: true,
      company: {
        published: true,
      },
    },
  });
}
