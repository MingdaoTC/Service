"use server";
import { auth } from "@/library/auth";
import { upload } from "@/library/storage/upload";

import { createResumeByUser } from "@/library/prisma/resume/create";

import { User } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { resumeFileSizeLimit } from "../limitationConfig";

export async function createNewResume(formData: FormData) {
  const session = await auth();
  const user = session?.user as User;

  if (!user || !user.email) {
    return { error: "Unauthorized" };
  }

  try {
    const file = formData.get("resume") as File;
    const title = formData.get("title") as string;

    if (!file || !(file instanceof File) || file.size === 0) {
      return { error: "No file uploaded" };
    }

    if (file.type !== "application/pdf") {
      return { error: "Only PDF files are allowed" };
    }

    if (file.size > resumeFileSizeLimit) {
      return { error: "File size is too large" };
    }

    if (!title) {
      return { error: "Title is required" };
    }

    const response = await uploadToBucket(
      file,
      `${user.email}/${title}_${Date.now()}.pdf`
    );

    const _resume = await createResumeByUser(
      {
        name: title,
        objectKey: response.key as string,
      },
      user.email
    );
    revalidatePath("/profile");
  } catch (error) {
    console.error("Error uploading resume:", error);
    return { error: "Failed to upload resume" };
  }
  redirect("/profile");
}

async function uploadToBucket(file: File | Blob, filename: string) {
  try {
    const response = await upload(
      file,
      `resume/${filename}`,
      "application/pdf"
    );
    return response;
  } catch (_) {
    throw new Error("Failed to upload resume");
  }
}
