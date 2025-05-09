import { prisma } from "@/library/db/prisma";

import { User } from "@/prisma/client";

export async function createUser(newData: User) {
  const user = await prisma.user.create({
    data: newData,
  });
  return user;
}
