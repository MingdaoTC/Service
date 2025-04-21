import { prisma } from "@/lib/db/prisma";
import { User } from "@/prisma/client";

export type updateUserTypes = {
  id?: string;
  username?: string;
  email?: string;
};

export async function updateUser(param: updateUserTypes, newData: Partial<User>) {
  if (!param.id && !param.username && !param.email) {
    throw new Error("At least one parameter should be provided.");
  }

  if (!newData) {
    throw new Error("No data to update.");
  }

  return await prisma.user.update({
    where: {
      id: param.id,
      username: param.username,
      email: param.email,
    },
    data: newData,
  });
}
