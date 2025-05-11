import { prisma } from "@/library/prisma";

export async function findUserProfileByEmail(email: string) {
  try {
    const userWithProfile = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        userProfile: true,
      },
    });

    if (!userWithProfile) {
      return { profile: null, profileExists: false, error: null };
    }

    const profileExists = userWithProfile.userProfile !== null;

    return {
      profile: userWithProfile.userProfile,
      profileExists: profileExists,
    };
  } catch (error) {
    return { profile: null, profileExists: false, error: error };
  }
}
