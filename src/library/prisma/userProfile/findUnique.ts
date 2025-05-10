import { prisma } from "@/library/prisma";
import { UserProfile } from "@/prisma/client";

export async function findUniqueUser(param: Partial<UserProfile>) {
  if (!param.id && !param.email) {
    throw new Error("At least one parameter should be provided.");
  }

  return await prisma.userProfile.findUnique({
    where: {
      id: param.id,
      email: param.email,
    },
  });
}
