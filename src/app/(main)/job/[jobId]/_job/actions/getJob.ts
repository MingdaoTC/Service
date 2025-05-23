import { findUniqueJobWithPublished } from "@/library/prisma/job/findUnique";

export async function getJobById(jobId: string) {
  try {
    const job = await findUniqueJobWithPublished({ id: jobId });
    return job;
  } catch (error) {
    console.error(error);
    return null;
  }
}
