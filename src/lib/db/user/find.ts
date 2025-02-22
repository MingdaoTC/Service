import { prisma } from "@/lib/prisma";

type findUserTypes = {
  id?: string;
  username?: string;
  email?: string;
};

export async function findUser(param: findUserTypes) {
  const whereClause: Partial<findUserTypes> = {};

  if (param.id) whereClause.id = param.id;
  if (param.username) whereClause.username = param.username;
  if (param.email) whereClause.email = param.email;

  return await prisma.user.findUnique({
    where: whereClause,
  });
}
