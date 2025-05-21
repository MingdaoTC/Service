"use server";

import { deleteJob } from "@/library/prisma/job/remove";
import { Job } from "@/prisma/client";

export async function handleJobDelete(jobData: Partial<Job>) {
  try {
    await deleteJob(jobData);
    return "OK";
  } catch (error) {
    return { message: error };
  }
}
