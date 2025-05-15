"use server";

import { updateCompany } from "@/library/prisma/company/update";
import { Company } from "@/prisma/client";

export async function handleUpdate(companyData: Partial<Company>) {
  const { id, ...data } = companyData;
  await updateCompany({ email: companyData.email }, data);
  return "OK";
}
