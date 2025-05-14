import { prisma } from "@/library/prisma";
import { Resume, User } from "@/prisma/client";
export async function findManyResumeByUserEmail(
  userEmail: string,
): Promise<Resume[]> {
  if (!userEmail || typeof userEmail !== "string" || userEmail.trim() === "") {
    throw new Error("Invalid or empty user email provided.");
  }

  let user: User | null;
  try {
    user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });
  } catch (error) {
    console.error(`Error finding user with email ${userEmail}:`, error);
    throw new Error(
      `An unexpected error occurred while trying to find user ${userEmail}.`,
    );
  }

  if (!user) {
    throw new Error(`User with email ${userEmail} not found.`);
  }

  try {
    const resumes = await prisma.resume.findMany({
      where: {
        email: userEmail,
      },
    });
    return resumes;
  } catch (error) {
    console.error(`Error fetching resumes for email ${userEmail}:`, error);
    throw new Error(
      `An unexpected error occurred while fetching resumes for email ${userEmail}.`,
    );
  }
}
