import { prisma } from "@/library/prisma";

export async function findManyApplication(params?: { where?: any }) {
  return await prisma.application.findMany({
    where: params?.where,
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
