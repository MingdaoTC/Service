import { prisma } from "@/library/prisma";
import { Job } from "@/prisma/client";

export async function deleteJob(params: Partial<Job>) {
  return await prisma.job.delete({
    where: {
      id: params.id,
    },
  });
}
