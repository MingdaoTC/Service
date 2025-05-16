"use server";

import { findManyJob } from "@/library/prisma/job/findMany";
import { findManyCompanyWithPublished } from "@/library/prisma/company/findMany";
import { findManyCompanyCategory } from "@/library/prisma/companyCategory/findMany";

export async function getJob() {
  return await findManyJob();
}

export async function getCompany() {
  return await findManyCompanyWithPublished();
}

export async function getCategory() {
  return await findManyCompanyCategory();
}
