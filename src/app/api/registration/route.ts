// Modules
import { NextRequest, NextResponse } from 'next/server';


// types
import type { User } from "@/prisma/client";

// libs
import { auth } from '@/lib/auth/auth';
import { findManyRegistration } from "@/lib/db/registration/findMany";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    let email = searchParams.get('email') || null;

    try {
        const session = await auth()
        const user: User = session?.user as User;

        if (!session?.user) {
            return NextResponse.json(
            { status: 403, error: '您沒有權限查看內容' },
            { status: 403 }
            );
        }

        if (user.role !== "admin" && user.role !== "superadmin") {
            return NextResponse.json(
            { status: 403, error: '您沒有權限查看內容' },
            { status: 403 }
            );
        }

        const registrations =  await findManyRegistration();

        return NextResponse.json({ status: 200, data: registrations }, {status: 200});
    } catch (error) {
        return NextResponse.json(
        { success: 500, error: '伺服器發生錯誤，請稍後重試' },
        { status: 500 }
        );
    }
}