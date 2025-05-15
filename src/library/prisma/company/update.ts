import { prisma } from "@/library/prisma";
import { Company } from "@/prisma/client";

export async function updateCompany(
  param: Partial<Company>,
  data: Partial<Company>
) {
  if (!param.id && !param.email) {
    throw new Error("At least one parameter should be provided.");
  }

  if (!data) {
    throw new Error("No data to update.");
  }

  return await prisma.company.update({
    where: {
      id: param.id,
      email: param.email,
    },
    data: data,
  });
}
