"use server";

import { findUserProfileByEmail } from "@/library/prisma/userProfile/findUnique";

export async function getProfile(email: string) {
  return await findUserProfileByEmail(email);
}
