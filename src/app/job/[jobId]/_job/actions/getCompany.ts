import { findUniqueCompany } from "@/library/prisma/company/findUnique";

export const getCompanyById = async (id: string) => {
  try {
    const company = await findUniqueCompany({ id });
    return company;
  } catch (error) {
    console.error(error);
    return null;
  }
};
