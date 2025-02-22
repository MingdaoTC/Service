import { PrismaClient } from "@prisma/client";

import { User } from "@/types/User";

const prisma = new PrismaClient();

async function createUser(newData: User) {
  const user = await prisma.user.create(newData);
  return user;
}

export default createUser;
