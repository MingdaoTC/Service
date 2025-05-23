import { auth } from "@/library/auth";
import { findManyCompanyForAdmin } from "@/library/prisma/company/findMany";
import { User, UserRole } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    const user: User = session?.user as User;

    if (!session?.user) {
      return NextResponse.json(
        { status: 403, message: "您沒有權限查看內容" },
        { status: 403 },
      );
    }

    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN) {
      return NextResponse.json(
        { status: 403, message: "您沒有權限查看內容" },
        { status: 403 },
      );
    }

    const companies = await findManyCompanyForAdmin();

    return NextResponse.json({ status: 200, data: companies }, { status: 200 });
  } catch (_error) {
    return NextResponse.json(
      { status: 500, message: "伺服器發生錯誤，請稍後重試" },
      { status: 500 },
    );
  }
}
