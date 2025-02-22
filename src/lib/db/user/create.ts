import { prisma } from "@/lib/prisma";

import { User } from "@/types/User";

export async function createUser(newData: User) {
  const user = await prisma.user.create({
    data: newData,
  });
  return user;
}
