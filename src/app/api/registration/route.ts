// Modules
import { NextRequest, NextResponse } from "next/server";

// types
import { User, UserRole } from "@/prisma/client";

// libs
import { auth } from "@/library/auth";
import { findManyRegistration } from "@/library/prisma/registration/findMany";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const _email = searchParams.get("email") || null;

  try {
    const session = await auth();
    const user: User = session?.user as User;

    if (!session?.user) {
      return NextResponse.json(
        { status: 403, message: "您沒有權限查看內容" },
        { status: 403 }
      );
    }

    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN) {
      return NextResponse.json(
        { status: 403, message: "您沒有權限查看內容" },
        { status: 403 }
      );
    }

    const registrations = await findManyRegistration();

    return NextResponse.json(
      { status: 200, data: registrations },
      { status: 200 }
    );
  } catch (_error) {
    return NextResponse.json(
      { status: 500, message: "伺服器發生錯誤，請稍後重試" },
      { status: 500 }
    );
  }
}
