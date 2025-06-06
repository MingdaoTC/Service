"use server";

import { auth } from "@/library/auth";
import { findManyAlumniRegistration } from "@/library/prisma/registration/alumni/findMany";
import { findManyCompanyRegistration } from "@/library/prisma/registration/company/findMany";
import {
  AlumniRegistration,
  CompanyRegistration,
  RegistrationStatus,
} from "@/prisma/client";

export async function checkRegistrationStatus() {
  try {
    // Ensure we have a valid user session
    const session = await auth();
    if (!session?.user?.email) {
      return {
        success: false,
        error: "Not authenticated",
        data: null,
      };
    }

    let registerType = "alumni";
    let alreadyRegistered = false;
    let status: RegistrationStatus = RegistrationStatus.PENDING;

    const registration = await findManyAlumniRegistration({
      email: session.user.email,
    });

    registration.map(async (registration: AlumniRegistration) => {
      if (
        registration.status === RegistrationStatus.PENDING ||
        registration.status === RegistrationStatus.APPROVED
      ) {
        alreadyRegistered = true;
        if (registration.status === RegistrationStatus.APPROVED) {
          status = RegistrationStatus.APPROVED;
        }
      }
    });

    const registration2 = await findManyCompanyRegistration({
      email: session.user.email,
    });

    registration2.map(async (registration: CompanyRegistration) => {
      if (
        registration.status === RegistrationStatus.PENDING ||
        registration.status === RegistrationStatus.APPROVED
      ) {
        registerType = "corporate";
        alreadyRegistered = true;

        if (registration.status === RegistrationStatus.APPROVED) {
          status = RegistrationStatus.APPROVED;
        }
      }
    });

    if (alreadyRegistered) {
      return {
        success: true, // 修改: 改為 true，表示操作成功獲取到了狀態
        data: {
          isRegistered: true,
          type: registerType,
          status: status,
        },
      };
    }

    // No existing registration
    return {
      success: true,
      data: {
        isRegistered: false,
      },
    };
  } catch (error) {
    console.error("Error checking registration status:", error);
    return {
      success: false,
      error: (error as Error).message,
      data: null,
    };
  }
}
