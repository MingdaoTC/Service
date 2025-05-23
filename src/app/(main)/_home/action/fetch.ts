"use server";
import { findManyCompanyWithPublished } from "@/library/prisma/company/findMany";
import { findManyCompanyCategory } from "@/library/prisma/companyCategory/findMany";
import { findManyJob } from "@/library/prisma/job/findMany";
import { findManyJobCategory } from "@/library/prisma/jobCategory/findMany";

export async function getJob(_jobs?: any) {
  return await findManyJob({
    where: {
      published: true,
      company: {
        published: true,
      },
    },
  });
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
