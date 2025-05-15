import { prisma } from "@/library/prisma";

export async function findManyCompany() {
  return await prisma.company.findMany();
}

export async function findManyCompanyWithPublished() {
  return await prisma.company.findMany({
    where: {
      published: true,
    },
  });
}
