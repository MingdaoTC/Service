import { prisma } from "@/library/prisma";
import { Prisma } from "@/prisma/client";

export type ApplicationCreateInput = Omit<
  Prisma.ApplicationCreateInput,
  "user"
>;

export async function createApplication(
  data: ApplicationCreateInput,
  userEmail: string,
) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const applicationCreateInput: Prisma.ApplicationCreateInput = {
    ...data,
    user: {
      connect: {
        email: userEmail, // Connects to the User record via User.email
      },
    },
  };

  try {
    const newApplication = await prisma.application.create({
      data: applicationCreateInput,
    });
    return newApplication;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002: "Unique constraint failed on the {constraint}"
      if (error.code === "P2002") {
        throw new Error("Application already exists");
      }
    }
    throw error;
  }
}
