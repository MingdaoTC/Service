"use server";
import { findManyCompanyCategory } from "@/library/prisma/companyCategory/findMany";

export async function fetchCategory() {
  return await findManyCompanyCategory();
}
