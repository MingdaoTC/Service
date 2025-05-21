"use server";

import { auth } from "@/library/auth";

import { createUserProfile } from "@/library/prisma/userProfile/create";
import { Gender } from "@/prisma/client";

import { User } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProfile(formData: FormData) {
  const session = await auth();
  const user = session?.user as User;

  if (!user || !user.email) {
    return { error: "Unauthorized" };
  }

  try {
    const now = new Date();
    const data = {
      birthday: formData.get("birthday") as string,
      identityNumber: formData.get("identityNumber") as string,
      website: (formData.get("website") as string) || null,
      phone: (formData.get("phone") as string) || null,
      description: (formData.get("description") as string) || null,
      gender: formData.get("gender") as Gender,
      location: (formData.get("location") as string) || null,
      talent: (formData.get("talent") as string) || null,
      education: (formData.get("education") as string) || null,
      experience: (formData.get("experience") as string) || null,
      createdAt: now,
      updatedAt: now,
    };

    // @ts-ignore
    await createUserProfile(user.email, data);
    revalidatePath("/profile");
  } catch (_) {
    return { error: "Failed to create profile" };
  }
  redirect("/profile");
}
