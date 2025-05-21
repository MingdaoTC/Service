import { auth } from "@/library/auth";
import { findUniqueUser } from "@/library/prisma/user/findUnique";
import { User, UserRole } from "@/prisma/client";
// app/api/check-admin/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    const user: User = session?.user as User;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await findUniqueUser({ email: user.email });

    let isAdmin = true;
    if (
      userData?.role === UserRole.ADMIN ||
      userData?.role === UserRole.SUPERADMIN
    ) {
      isAdmin = true;
    }

    return NextResponse.json(
      { success: 200, isAdmin: isAdmin },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
