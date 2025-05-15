import { NextRequest, NextResponse } from "next/server";
import { upload } from "@/library/r2/upload";
import { deleteObject } from "@/library/r2/delete";
import { updateCompany } from "@/library/prisma/company/update";

import { auth } from "@/library/auth";
import { User } from "@/prisma/client";
import { findUniqueCompany } from "@/library/prisma/company/findUnique";

export async function POST(request: NextRequest) {
  const session = await auth();
  const user: User = session?.user as User;

  if (!user) {
    return NextResponse.json(
      { status: 403, message: "您沒有權限查看內容" },
      { status: 403 }
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
        { status: 400 }
      );
    }

    if (company.logoUrl !== "") {
      const oldLogo = `${company.logoUrl}`;
      try {
        const deleteResult = await deleteObject(oldLogo);
        console.log(
          `嘗試刪除舊 logo: ${deleteResult.success ? "成功" : "失敗或不存在"}`
        );
      } catch (deleteError) {
        console.warn(`刪除舊 logo 時發生錯誤: ${deleteError}`);
      }
    }

    const date = Date.now();
    const extension = file.name.split(".").pop() || "";
    const filename = `company/${company.email}/logo/${date}.${extension}`;

    const uploadResult = await upload(file, filename, file.type);

    if (uploadResult && uploadResult.url) {
      await updateCompany(
        { email },
        {
          logoUrl: filename,
        }
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
      }
    );

    return NextResponse.json(
      { success: false, message: "Logo 上傳失敗" },
      { status: 500 }
    );
  } catch (error) {
    console.error(`Error uploading logo:`, error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "上傳過程發生未知錯誤",
      },
      { status: 500 }
    );
  }
}
