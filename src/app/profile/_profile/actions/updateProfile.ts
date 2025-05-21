"use server";

import { auth } from "@/library/auth";
import { updateUserProfile } from "@/library/prisma/userProfile/update";

import { Gender, UserProfile } from "@/prisma/client";

import { User } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type UserProfileUpdate = Omit<
  UserProfile,
  "id" | "email" | "createdAt" | "updatedAt" | "identityNumber" | "birthday"
>;

export async function updateProfile(formData: FormData) {
  const session = await auth();
  const user = session?.user as User;

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const data: UserProfileUpdate = {
      website: formData.get("website") as string,
      phone: formData.get("phone") as string,
      description: formData.get("description") as string,
      gender: formData.get("gender") as Gender,
      location: formData.get("location") as string,
      talent: formData.get("talent") as string,
      education: formData.get("education") as string,
      experience: formData.get("experience") as string,
    };

    await updateUserProfile(
      {
        email: user.email as string,
      },
      data,
    );

    revalidatePath("/profile");
  } catch (error) {
    return { error: (error as Error).message };
  }

  redirect("/profile");
}
