"use server";

import { Job } from "@/prisma/client";
import { deleteJob } from "@/library/prisma/job/remove";

export async function handleJobDelete(jobData: Partial<Job>) {
  try {
    await deleteJob(jobData);
    return "OK";
  } catch (error) {
    return { message: error };
  }
}
