// Modules
import { NextRequest, NextResponse } from "next/server";

// types
import {
  AccountStatus,
  User,
  UserRole,
  RegistrationStatus,
  CompanyRegistration,
  AlumniRegistration,
} from "@/prisma/client";

// libs
import { auth } from "@/library/auth";
import { createCompanyRegistration } from "@/library/prisma/registration/company/create";
import { updateUser } from "@/library/prisma/user/update";
import { findManyAlumniRegistration } from "@/library/prisma/registration/alumni/findMany";
import { findManyCompanyRegistration } from "@/library/prisma/registration/company/findMany";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email") || null;

  try {
    const session = await auth();
    const user: User = session?.user as User;

    if (!session?.user) {
      return NextResponse.json(
        { status: 403, error: "您沒有權限查看內容" },
        { status: 403 }
      );
    }

    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN) {
      return NextResponse.json(
        { status: 403, error: "您沒有權限查看內容" },
        { status: 403 }
      );
    }

    const registration = await findManyCompanyRegistration({
      email: email || user.email,
    });
    if (!registration) {
      return NextResponse.json(
        { status: 404, message: "您查詢的驗證申請資料不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: 200, data: registration },
      { status: 200 }
    );
  } catch (_error) {
    return NextResponse.json(
      { success: 500, error: "伺服器發生錯誤，請稍後重試" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const user: User = session?.user as User;

    const body = await request.json();
    const { companyName, companyId, name, phone, notes } = body;

    if (!session?.user) {
      return NextResponse.json(
        { status: 403, error: "您沒有權限查看內容" },
        { status: 403 }
      );
    }

    let registration = await findManyAlumniRegistration({
      email: user.email,
    });

    registration.forEach(async (registration: AlumniRegistration) => {
      if (registration.status === RegistrationStatus.PENDING) {
        return NextResponse.json(
          { status: 409, message: "您已經送過申請驗證資料或是已經通過驗證" },
          { status: 409 }
        );
      }
      if (registration.status === RegistrationStatus.APPROVED) {
        return NextResponse.json(
          { status: 409, message: "您已經送過申請驗證資料或是已經通過驗證" },
          { status: 409 }
        );
      }
    });

    let registration2 = await findManyCompanyRegistration({
      email: user.email,
    });

    registration2.forEach(async (registration: CompanyRegistration) => {
      if (registration.status === RegistrationStatus.PENDING) {
        return NextResponse.json(
          { status: 409, message: "您已經送過申請驗證資料或是已經通過驗證" },
          { status: 409 }
        );
      }
      if (registration.status === RegistrationStatus.APPROVED) {
        return NextResponse.json(
          { status: 409, message: "您已經送過申請驗證資料或是已經通過驗證" },
          { status: 409 }
        );
      }
    });

    //@ts-ignore
    registration = await createCompanyRegistration({
      email: user.email,
      companyId: companyId,
      companyName: companyName,
      name: name,
      phone: phone,
      notes: notes,
    });
    await updateUser({ email: user.email }, { status: AccountStatus.PENDING });

    return NextResponse.json(
      { status: 201, data: registration },
      { status: 201 }
    );
  } catch (_error) {
    return NextResponse.json(
      { success: 500, message: "伺服器發生錯誤，請稍後重試" },
      { status: 500 }
    );
  }
}
