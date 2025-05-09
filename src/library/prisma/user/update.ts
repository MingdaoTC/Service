import { prisma } from "@/library/prisma";
import { User } from "@/prisma/client";

export async function updateUser(param: Partial<User>, data: Partial<User>) {
  if (!param.id && !param.username && !param.email) {
    throw new Error("At least one parameter should be provided.");
  }

  if (!data) {
    throw new Error("No data to update.");
  }

  return await prisma.user.update({
    where: {
      id: param.id,
      username: param.username,
      email: param.email,
    },
    data: data,
  });
}
