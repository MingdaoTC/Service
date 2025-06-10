"use server";

import { findUniqueJob } from "../prisma/job/findUnique";

export async function getJobInfo(jobId: string) {
  try {
    const job = await findUniqueJob({ id: jobId });

    if (!job) {
      throw new Error("Job not found");
    }

    return job;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
