import { findUniqueJob } from "@/library/prisma/job/findUnique";

export async function getJobById(jobId: string) {
  try {
    const job = await findUniqueJob({ id: jobId });
    return job;
  } catch (error) {
    console.error(error);
    return null;
  }
}
