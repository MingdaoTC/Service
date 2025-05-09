import { prisma } from "@/library/prisma";
import { User } from "@/prisma/client";

export async function findUniqueUser(param: Partial<User>) {
  if (!param.id && !param.username && !param.email) {
    throw new Error("At least one parameter should be provided.");
  }

  return await prisma.user.findUnique({
    where: {
      id: param.id,
      username: param.username,
      email: param.email,
    },
  });
}
