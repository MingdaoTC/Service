"use server";

import { auth } from "@/library/auth";
import { findUniqueCompany } from "@/library/prisma/company/findUnique";
import { findManyCompanyCategory } from "@/library/prisma/companyCategory/findMany";
import { findManyJob } from "@/library/prisma/job/findMany";
import { findManyJobCategory } from "@/library/prisma/jobCategory/findMany";
import { User } from "@/prisma/client";

export async function getCompanyData() {
  const session = await auth();
  const user = session?.user as User;

  if (!user) {
    throw new Error("User not found");
  }

  return await findUniqueCompany({ email: user.email });
}

export async function getJobsDataByCompanyWithUser() {
  const session = await auth();
  const user = session?.user as User;
  if (!user) {
    throw new Error("User not found");
  }

  const company = await findUniqueCompany({ email: user.email });
  if (!company) {
    throw new Error("Company not found");
  }

  return await findManyJob({
    where: {
      company: {
        id: company.id,
      },
    },
  });
}

export async function getCompanyCategoryData() {
  return await findManyCompanyCategory();
}

export async function getJobCategoryData() {
  return await findManyJobCategory();
}
