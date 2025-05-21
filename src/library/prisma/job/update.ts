import { prisma } from "@/library/prisma";
import { Job } from "@/prisma/client";

export async function updateJob(param: Partial<Job>, data: Partial<Job>) {
  if (!param.id) {
    throw new Error("At least one parameter should be provided.");
  }

  if (!data) {
    throw new Error("No data to update.");
  }

  return await prisma.job.update({
    where: {
      id: param.id,
    },
    data: data,
  });
}
