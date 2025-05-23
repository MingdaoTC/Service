import { prisma } from "@/library/prisma";
import { Company } from "@/prisma/client";

export async function findUniqueCompany(param: Partial<Company>) {
  if (!param.id && !param.email) {
    throw new Error("At least one parameter should be provided.");
  }

  return await prisma.company.findUnique({
    where: {
      id: param.id,
      email: param.email,
    },
    include: {
      jobs: true,
    },
  });
}

export async function findUniqueCompanyWithPublished(param: Partial<Company>) {
  if (!param.id && !param.email) {
    throw new Error("At least one parameter should be provided.");
  }

  return await prisma.company.findUnique({
    where: {
      id: param.id,
      email: param.email,
      published: true,
    },
    include: {
      jobs: true,
    },
  });
}
