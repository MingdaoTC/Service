"use server";

import { updateCompany } from "@/library/prisma/company/update";
import { Company } from "@/prisma/client";

export async function handleUpdate(companyData: Partial<Company>) {
  const { id, email, name, unifiedNumber, ...data } = companyData;
  await updateCompany({ email: email }, data);
  return "OK";
}
