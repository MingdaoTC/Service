import { prisma } from "@/library/prisma";
import { JobCategory } from "@/prisma/client";

export async function createJobCategory(data: JobCategory) {
  return await prisma.jobCategory.create({
    data: data,
  });
}
