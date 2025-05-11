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
      return { user: null, profileExists: false, error: null };
    }

    const profileExists = userWithProfile.userProfile !== null;

    return { user: userWithProfile, profileExists: profileExists };
  } catch (error) {
    return { user: null, profileExists: false, error: error };
  }
}
