import { updateCompany } from "@/library/prisma/company/update";
import { deleteObject } from "@/library/storage//delete";
import { upload } from "@/library/storage/upload";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/library/auth";
import { findUniqueCompany } from "@/library/prisma/company/findUnique";
import { User } from "@/prisma/client";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  const session = await auth();
  const user: User = session?.user as User;

  if (!user) {
    return NextResponse.json(
      { status: 403, message: "您沒有權限查看內容" },
      { status: 403 },
    );
  }

  const company = await findUniqueCompany({ email: user.email });

  if (!company) {
    return NextResponse.json({ status: 403, message: "名下無公司紀錄" });
  }

  const email = company.email;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "缺少必要參數" },
        { status: 400 },
      );
    }

    if (company.logoUrl !== "") {
      const oldLogo = `${company.logoUrl}`;
      try {
        await deleteObject(oldLogo, {
          bucketName: process.env.NEXT_PUBLIC_S3_BUCKET_PUBLIC_NAME,
        });
      } catch (deleteError) {
        console.warn(`刪除舊 logo 時發生錯誤: ${deleteError}`);
      }
    }

    const date = Date.now();
    const filename = `company/${company.email}/logo/${date}.webp`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const webpImage = await sharp(buffer)
      .resize({ height: 256 })
      .webp({ quality: 50 })
      .toBuffer();
    const blob = new Blob([webpImage], { type: "image/webp" });
    const uploadResult = await upload(blob, filename, blob.type, {
      bucketName: process.env.NEXT_PUBLIC_S3_BUCKET_PUBLIC_NAME,
    });
    if (uploadResult?.url) {
      await updateCompany(
        { email },
        {
          logoUrl: filename,
        },
      );

      return NextResponse.json({
        success: true,
        url: filename,
        message: "Logo 上傳成功",
      });
    }

    await updateCompany(
      { email },
      {
        logoUrl: "",
      },
    );

    return NextResponse.json(
      { success: false, message: "Logo 上傳失敗" },
      { status: 500 },
    );
  } catch (error) {
    console.error("Error uploading logo:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "上傳過程發生未知錯誤",
      },
      { status: 500 },
    );
  }
}
