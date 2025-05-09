import { prisma } from "@/library/prisma";
import { UserProfile } from "@/prisma/client";

export async function createUserProfile(data: UserProfile) {
  return await prisma.userProfile.create({
    data: data,
  });
}
