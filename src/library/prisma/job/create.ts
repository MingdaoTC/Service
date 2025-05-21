import { prisma } from "@/library/prisma";
import { Job } from "@/prisma/client";

export async function createJob(data: Job) {
  return await prisma.job.create({
    data: data,
  });
}
