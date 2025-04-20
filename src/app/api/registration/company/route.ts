// Modules
import { NextRequest, NextResponse } from 'next/server';


// types
import type { CompanyRegistration, User } from "@/prisma/client";

// libs
import { auth } from '@/lib/auth/auth';
import { findCompanyRegistration } from "@/lib/db/registration/company/find";
import { createCompanyRegistration } from "@/lib/db/registration/company/create";

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        const user: User = session?.user as User;

        // if (!session?.user) {
        //     return NextResponse.json(
        //     { status: 403, error: '您沒有權限查看內容' },
        //     { status: 403 }
        //     );
        // }

        if (user.role !== "admin" && user.role !== "superadmin") {
            return NextResponse.json(
            { status: 403, error: '您沒有權限查看內容' },
            { status: 403 }
            );
        }

        const registration =  await findCompanyRegistration({ email: user.email });
        if (!registration) {
            return NextResponse.json(
                { status: 404, message: "您查詢的驗證申請資料不存在" },
                { status: 404 }
                );
        }

        return NextResponse.json({ success: true, data: registration });
    } catch (error) {
        return NextResponse.json(
        { success: 500, error: '伺服器發生錯誤，請稍後重試' },
        { status: 500 }
        );
    }
}

export async function POST() {
    try {
        const session = await auth()
        const user: User = session?.user as User;

        // if (!session?.user) {
        //     return NextResponse.json(
        //     { status: 403, error: '您沒有權限查看內容' },
        //     { status: 403 }
        //     );
        // }

        const registration =  await findCompanyRegistration({ email: user.email });
        if (registration) {
            return NextResponse.json(
                { status: 409, message: '您已經送過申請驗證資料或是已經通過驗證' },
                { status: 409 }
                );
        }

      return NextResponse.json({ success: true, data: registration });
    } catch (error) {
      return NextResponse.json(
        { success: 500, message: '伺服器發生錯誤，請稍後重試' },
        { status: 500 }
      );
    }
}