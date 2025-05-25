"use server";
import { auth } from "@/library/auth";
import { User } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createApplication } from "../prisma/application/create";

export async function createNewApplication(formData: FormData) {
  const session = await auth();
  const user = session?.user as User;

  if (!user || !user.email) {
    return { error: "Unauthorized" };
  }

  const jobId = formData.get("jobId") as string;
  const resumeId = formData.get("resumeId") as string;
  const companyId = formData.get("companyId") as string;
  const coverLetter = formData.get("coverLetter") as string;

  if (!jobId || !resumeId || !companyId) {
    return { error: "請完整填寫表單" };
  }

  try {
    await createApplication(
      {
        jobId,
        resumeId,
        companyId,
        coverLetter,
      },
      user.email,
    );
    revalidatePath(`/job/${jobId}`);
  } catch (_) {
    return { error: "應徵功能發生錯誤" };
  }
  redirect(`/job/${jobId}`);
}
