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

export async function findManyCompanyForAdmin() {
  return await prisma.company.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          status: true,
        },
      },
      category: true,
      _count: {
        select: {
          jobs: true,
        },
      },
      jobs: {
        select: {
          id: true,
          title: true,
          published: true,
        },
        take: 10, // Limit to prevent too much data
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
