"use server";

import { auth } from "@/library/auth";
import { findManyApplication } from "@/library/prisma/application/findMany";
import { Application, User as PrismaUser, UserRole } from "@/prisma/client";
import { User } from "next-auth";
import { findUniqueCompany } from "../prisma/company/findUnique";
import { findUniqueUser } from "../prisma/user/findUnique";

export async function getApplicationListByCompanyUser(): Promise<
  (Application & { user: PrismaUser })[] | { error: string }
> {
  const session = await auth();
  const user = session?.user as User;

  if (!user || !user.email) {
    return { error: "Unauthorized" };
  }

  const dbUser = await findUniqueUser({ email: user.email });

  if (!dbUser) {
    return { error: "User not found" };
  }

  if (dbUser.role !== UserRole.COMPANY && dbUser.role !== UserRole.SUPERADMIN) {
    return { error: "Unauthorized" };
  }

  const company = await findUniqueCompany({ email: user.email });
  if (!company) {
    return { error: "Company not found" };
  }

  try {
    const applications = await findManyApplication({
      where: {
        companyId: company.id,
      },
    });
    return applications;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return { error: "Failed to fetch applications" };
  }
}
