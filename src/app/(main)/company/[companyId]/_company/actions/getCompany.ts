import {
  findUniqueCompany,
  findUniqueCompanyWithPublished,
} from "@/library/prisma/company/findUnique";

export const getCompanyByEmail = async (email: string) => {
  try {
    const company = await findUniqueCompany({ email });
    return company;
  } catch (_) {
    return null;
  }
};

export const getCompanyById = async (id: string) => {
  try {
    const company = await findUniqueCompanyWithPublished({ id });
    return company;
  } catch (error) {
    console.error(error);
    return null;
  }
};
