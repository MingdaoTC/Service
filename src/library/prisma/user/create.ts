import { prisma } from "@/library/prisma";
import { User } from "@/prisma/client";

export async function createUser(data: User) {
  return await prisma.user.create({
    data: data,
  });
}
