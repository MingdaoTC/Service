import { prisma } from "@/library/prisma";

export async function findManyCompany() {
  return await prisma.company.findMany();
}

export async function findManyCompanyWithPublished() {
  return await prisma.company.findMany({
    where: {
      published: true,
    },
    include: {
      category: true,
    },
  });
}

export async function findManyCompanyWithPublishedWithJobs() {
  return await prisma.company.findMany({
    where: {
      published: true,
    },
    include: {
      category: true,
      jobs: {
        where: {
          published: true,
        },
      },
    },
  });
}
