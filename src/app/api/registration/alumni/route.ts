// Modules
import { NextRequest, NextResponse } from 'next/server';

// types
import type { User } from "@/prisma/client";

// libs
import { auth } from '@/lib/auth/auth';
import { updateUser } from '@/lib/db/user/update';
import { findAlumniRegistration } from "@/lib/db/registration/alumni/find";
import { findCompanyRegistration } from "@/lib/db/registration/company/find";
import { createAlumniRegistration } from "@/lib/db/registration/alumni/create";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    let email = searchParams.get('email') || null;

    try {
        const session = await auth()
        const user: User = session?.user as User;

        if (!session?.user) {
            return NextResponse.json(
            { status: 403, message: '您沒有權限查看內容' },
            { status: 403 }
            );
        }

        if (user.role !== "admin" && user.role !== "superadmin") {
            return NextResponse.json(
            { status: 403, message: '您沒有權限查看內容' },
            { status: 403 }
            );
        }

        const registration =  await findAlumniRegistration({ email: email || user.email  });
        if (!registration) {
            return NextResponse.json(
                { status: 404, message: "您查詢的驗證申請資料不存在" },
                { status: 404 }
                );
        }

        return NextResponse.json({ success: true, data: registration }, {status: 200});
    } catch (error) {
        return NextResponse.json(
        { success: 500, message: '伺服器發生錯誤，請稍後重試' },
        { status: 500 }
        );
    }
}


export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        const user: User = session?.user as User;

        const body = await request.json();
        const { name, phone, studentCardFront, studentCardBack, idDocumentFront, idDocumentBack, idDocumentPassport, notes } = body;

        if (!session?.user) {
            return NextResponse.json(
            { status: 403, error: '您沒有權限查看內容' },
            { status: 403 }
            );
        }

        let registration =  await findCompanyRegistration({ email: user.email });
        let registration2 =  await findAlumniRegistration({ email: user.email });

        if (registration || registration2) {
            return NextResponse.json(
                { status: 409, message: '您已經送過申請驗證資料或是已經通過驗證' },
                { status: 409 }
                );
        } else {
            //@ts-ignore
            registration = await createAlumniRegistration({
                email: user.email,
                name: name,
                phone: phone,
                studentCardFront: studentCardFront,
                studentCardBack: studentCardBack,
                idDocumentFront: idDocumentFront,
                idDocumentBack: idDocumentBack,
                idDocumentPassport: idDocumentPassport,
                notes: notes,
            });
            await updateUser({ email: user.email }, { verified: "pending" });
        }

      return NextResponse.json({ status: 201, data: registration }, {status: 201});
    } catch (error) {
      return NextResponse.json(
        { success: 500, message: '伺服器發生錯誤，請稍後重試' },
        { status: 500 }
      );
    }
}