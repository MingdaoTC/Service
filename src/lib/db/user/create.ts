import { prisma } from "@/lib/db/prisma";

import { User } from "@/app/prisma/client";

export async function createUser(newData: User) {
  const user = await prisma.user.create({
    data: newData,
  });
  return user;
}
