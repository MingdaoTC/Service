"use server";

import { updateUserProfile } from "@/library/prisma/userProfile/update";
import { auth } from "@/library/auth";

import { Gender, UserProfile } from "@/prisma/client";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { User } from "next-auth";

export type UserProfileUpdate = Omit<
  UserProfile,
  "id" | "email" | "createdAt" | "updatedAt" | "identityNumber"
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
      birthday: formData.get("birthday") as string,
      location: formData.get("location") as string,
      talent: formData.get("talent") as string,
      education: formData.get("education") as string,
      experience: formData.get("experience") as string,
    };

    await updateUserProfile(
      {
        id: user.id,
        email: user.email as string,
      },
      data,
    );

    revalidatePath("/profile");

    redirect("/profile");
  } catch (error) {
    console.error("Updating data error:", error);
    return { error: "" };
  }
}
