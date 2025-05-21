import { prisma } from "@/library/prisma";

export async function findManyJob(params?: { where?: any }) {
  return await prisma.job.findMany({
    where: params?.where,
    include: {
      company: true,
      category: true,
    },
  });
}
