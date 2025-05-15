"use server";

import { findManyJob } from "@/library/prisma/job/findMany";
import { findManyCompanyWithPublished } from "@/library/prisma/company/findMany";

export async function getJob() {
  return await findManyJob();
}

export async function getCompany() {
  return await findManyCompanyWithPublished();
}
