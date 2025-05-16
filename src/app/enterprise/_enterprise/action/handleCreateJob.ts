"use server";

import { Job } from "@/prisma/client";
import { createJob } from "@/library/prisma/job/create";
import { getCompanyData } from "./fetch";

export async function handleCreateJob(jobData: Partial<Job>) {
  try {
    const company = await getCompanyData();
    if (!company) {
      throw new Error("Company not found");
    }

    jobData.companyId = company.id;

    // @ts-ignore
    await createJob(jobData);
    return "OK";
  } catch (error) {
    return { message: error };
  }
}
