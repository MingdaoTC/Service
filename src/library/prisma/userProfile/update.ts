import { prisma } from "@/library/prisma";
import { UserProfile } from "@/prisma/client";

export async function updateUserProfile(
  param: Partial<UserProfile>,
  data: Partial<UserProfile>,
) {
  if (!param.id && !param.email) {
    throw new Error("At least one parameter should be provided.");
  }

  if (!data) {
    throw new Error("No data to update.");
  }

  return await prisma.userProfile.update({
    where: {
      email: param.email,
    },
    data: data,
  });
}
