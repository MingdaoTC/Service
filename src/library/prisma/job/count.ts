import { prisma } from "@/library/prisma";
import { Job } from "@/prisma/client";

export async function countJob(param: Partial<Job>) {
  if (!param.companyId) {
    throw new Error("No job information provided");
  }

  return await prisma.job.count({
    where: {
      company: {
        id: param.companyId,
      },
    },
  });
}
