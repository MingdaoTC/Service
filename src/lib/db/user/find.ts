import { prisma } from "@/lib/prisma";

type findUserTypes = {
  id?: string;
  username?: string;
  email?: string;
};

export async function findUser(param: findUserTypes) {
  return await prisma.user.findUnique({
    where: {
      id: param.id,
      username: param.username,
      email: param.email,
    },
  });
}
