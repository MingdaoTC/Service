"use server";

import { auth } from "@/library/auth";
import { findUniqueCompany } from "@/library/prisma/company/findUnique";
import { findManyCompanyCategory } from "@/library/prisma/companyCategory/findMany";
import { User } from "@/prisma/client";

export async function getCompanyData() {
  const session = await auth();
  const user = session?.user as User;

  if (!user) {
    throw new Error("User not found");
  }

  return await findUniqueCompany({ email: user.email });
}

export async function getCompanyCategoryData() {
  return await findManyCompanyCategory();
}
