"use server";

import { auth } from "@/library/auth";

import { createUserProfile } from "@/library/prisma/userProfile/create";
import { Gender, Prisma } from "@/prisma/client";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { User } from "next-auth";

export async function createProfile(formData: FormData) {
  const session = await auth();
  const user = session?.user as User;

  if (!user || !user.email) {
    return { error: "Unauthorized" };
  }

  try {
    const data: Prisma.UserProfileCreateWithoutUserInput = {
      birthday: formData.get("birthday") as string,
      identityNumber: formData.get("identityNumber") as string,
      website: formData.get("website") as string,
      phone: formData.get("phone") as string,
      description: formData.get("description") as string,
      gender: formData.get("gender") as Gender,
      location: formData.get("location") as string,
      talent: formData.get("talent") as string,
      education: formData.get("education") as string,
      experience: formData.get("experience") as string,
    };

    await createUserProfile(user.email, data);
    revalidatePath("/profile");

    redirect("/profile");
  } catch (_) {
    return { error: "Failed to create profile" };
  }
}
