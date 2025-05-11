import { prisma } from "@/library/prisma";
import { Prisma } from "@/prisma/client";

export async function createUserProfile(
  email: string,
  data: Prisma.UserProfileCreateWithoutUserInput,
) {
  return await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      userProfile: {
        create: data,
      },
    },
    include: {
      userProfile: true,
    },
  });
}
