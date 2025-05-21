"use server";

import { updateCompany } from "@/library/prisma/company/update";
import { updateJob } from "@/library/prisma/job/update";
import { Company, Job } from "@/prisma/client";

export async function handleUpdate(companyData: Partial<Company>) {
  const { id, email, name, unifiedNumber, ...data } = companyData;
  await updateCompany({ email: email }, data);
  return "OK";
}

export async function handleUpdateJob(jobData: Partial<Job>) {
  const { id, ...data } = jobData;
  await updateJob({ id: id }, data);
  return "OK";
}
