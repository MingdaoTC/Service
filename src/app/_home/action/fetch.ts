"use server";

import { findManyJob } from "@/library/prisma/job/findMany";
import { findManyCompanyWithPublished } from "@/library/prisma/company/findMany";
import { findManyCompanyCategory } from "@/library/prisma/companyCategory/findMany";
import { findManyJobCategory } from "@/library/prisma/jobCategory/findMany";

export async function getJob() {
  return await findManyJob();
}

export async function getCompany() {
  return await findManyCompanyWithPublished();
}

export async function getCompanyCategory() {
  return await findManyCompanyCategory();
}

export async function getJobCategory() {
  return await findManyJobCategory();
}
