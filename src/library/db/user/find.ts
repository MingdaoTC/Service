import { prisma } from "@/library/db/prisma";

export type findUserTypes = {
  id?: string;
  username?: string;
  email?: string;
};

export async function findUser(param: findUserTypes) {
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
