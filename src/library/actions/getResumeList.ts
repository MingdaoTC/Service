"use server";

import { findManyResumeByUserEmail } from "@/library/prisma/resume/findMany";

export async function getResumeListByUserEmail(email: string) {
  try {
    const resumes = await findManyResumeByUserEmail(email);
    return resumes;
  } catch (error) {
    console.error(`Error finding resumes for user ${email}:`, error);
    throw new Error(
      `An unexpected error occurred while trying to find resumes for user ${email}.`,
    );
  }
}
