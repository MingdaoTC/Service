import { prisma } from "@/library/prisma";
import { Prisma, Resume } from "@/prisma/client";

type ResumeCreateInput = Omit<Prisma.ResumeCreateInput, "user">;

export const createResumeByUser = async (
  data: ResumeCreateInput,
  userEmail: string,
): Promise<Resume> => {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const resumeCreateInput: Prisma.ResumeCreateInput = {
    ...data,
    user: {
      connect: {
        email: userEmail, // Connects to the User record via User.email
      },
    },
  };

  try {
    const newResume = await prisma.resume.create({
      data: resumeCreateInput,
    });
    return newResume;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002: "Unique constraint failed on the {constraint}"
      if (error.code === "P2002") {
        const target = error.meta?.target as string[] | undefined;
        if (target?.includes("email")) {
          throw new Error(
            `A resume associated with the email "${userEmail}" already exists. A user can only have one resume with the current setup.`,
            error,
          );
        }
      }

      // P2025: "An operation failed because it depends on one or more records that were required but not found. {cause}"
      if (error.code === "P2025") {
        throw new Error(
          "Failed to create resume: A required related record (e.g., User) was not found. This might indicate an issue with the user email provided.",
          error,
        );
      }
    }

    console.error("Error creating resume:", error); // Log the actual error for debugging
    throw new Error("An unexpected error occurred while creating the resume.");
  }
};
