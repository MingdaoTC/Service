// Modules
import { NextRequest, NextResponse } from "next/server";

// types
import { User, UserRole } from "@/prisma/client";

// libs
import { auth } from "@/lib/auth/auth";
import { findUser } from "@/lib/db/user/find";
import { createUser } from "@/lib/db/user/create";


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email") || null;

  try {
    const session = await auth();
    const user: User = session?.user as User;

    if (!user) {
      return NextResponse.json(
        { success: 403, message: "您沒有權限查看內容" },
        { status: 403 }
      );
    }

    if (user && email) {
      if (user.email !== email && user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN) {
        return NextResponse.json(
          { success: 403, message: "您沒有權限查看內容" },
          { status: 403 }
        );
      } 

      if (user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN) {
        const userData = await findUser({ email: email as string });
        if (!userData) {
          return NextResponse.json(
            { success: 404, message: "使用者不存在" },
            { status: 404 }
          );
        }

        return NextResponse.json({ success: true, data: userData }, { status: 200 });
      } else {
        const userData = await findUser({ email: email as string });
        if (!userData) {
          return NextResponse.json(
            { success: 404, message: "使用者不存在" },
            { status: 404 }
          );
        }

        return NextResponse.json({ success: true, data: userData }, { status: 200 });
      }
    } else if (user && !email){
      const userData = await findUser({ email: user.email });
      if (!userData) {
        return NextResponse.json(
          { success: 404, message: "使用者不存在" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: userData }, { status: 200 });
    }
  } catch (_error) {
    return NextResponse.json(
      { success: 500, message: "伺服器發生錯誤，請稍後重試" },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, displayName, avatarUrl } = body;

    if (!body || !body.email || !body.username || !body.displayName || !body.avatarUrl) {
      return NextResponse.json(
        { status: 400, message: "缺少必要的資料" }, 
        { status: 400 }
      );
    }

    let user = await findUser({ email: email });
    if (!user) {
      // @ts-ignore
      user = await createUser({
        username: username,
        displayName: displayName,
        email: email,
        avatarUrl: avatarUrl,
      });
    } else {
      return NextResponse.json(
        { status: 200, data: user },
        { status: 200 }
      );
    }

    return NextResponse.json({ status: 201, data: user }, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { success: 500, message: "伺服器發生錯誤，請稍後重試" },
      { status: 500 }
    );
  }
}