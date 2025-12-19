import { prisma } from "@/library/prisma";
import { UserProfile } from "@/prisma/client";

export async function createUserProfile(
  email: string,
  data: Omit<UserProfile, "id" | "email" | "createdAt" | "updatedAt" | "user">,
) {
  return await prisma.userProfile.create({
    data: {
      ...data,
      user: {
        connect: {
          email: email,
        },
      },
    },
  });
}
