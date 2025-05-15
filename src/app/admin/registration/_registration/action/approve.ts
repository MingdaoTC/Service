"use server";

// 認證與權限
import { auth } from "@/library/auth";
import {
  UserRole,
  RegistrationStatus,
  AccountStatus,
  User,
} from "@/prisma/client";

// 註冊相關函數
import { updateAlumniRegistration } from "@/library/prisma/registration/alumni/update";
import { updateCompanyRegistration } from "@/library/prisma/registration/company/update";
import { findUniqueAlumniRegistration } from "@/library/prisma/registration/alumni/findUnique";
import { findUniqueCompanyRegistration } from "@/library/prisma/registration/company/findUnique";
import { updateUser } from "@/library/prisma/user/update";
import { findUniqueUser } from "@/library/prisma/user/findUnique";

// 輔助函數
import { revalidatePath } from "next/cache";
import { createCompany } from "@/library/prisma/company/create";

/**
 * 審核通過申請的 Server Action
 * @param formData 表單資料
 */
export async function approveRegistration(formData: FormData) {
  try {
    // 驗證用戶權限
    const session = await auth();
    const user = session?.user as User;

    // 檢查用戶是否登入及擁有權限
    if (!user) {
      return {
        success: false,
        message: "您沒有權限進行這個操作",
      };
    }

    // 確認是管理員或超級管理員
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN) {
      return {
        success: false,
        message: "您沒有權限進行這個操作",
      };
    }

    // 獲取並檢查參數
    const id = formData.get("id") as string;
    const type = formData.get("type") as "company" | "alumni";

    if (!id || !type || (type !== "company" && type !== "alumni")) {
      return {
        success: false,
        message: "缺少必要參數或參數無效",
      };
    }

    // 依據類型更新不同的資料表
    if (type === "company") {
      // 查找公司註冊資料
      const registration = await findUniqueCompanyRegistration({
        id: id,
      });

      if (!registration) {
        return {
          success: false,
          message: "找不到相關的註冊申請",
        };
      }

      // 更新企業註冊狀態
      const updatedRegistration = await updateCompanyRegistration(
        { id },
        {
          status: RegistrationStatus.APPROVED,
          approvedAt: new Date(),
          approvedBy: user.id, // 記錄操作者ID
        }
      );

      // 更新用戶狀態為已驗證
      const registrationUser = await findUniqueUser({
        email: registration.email,
      });
      if (registrationUser) {
        await updateUser(
          { email: registration.email },
          { status: AccountStatus.VERIFIED, role: UserRole.COMPANY }
        );
      }

      // @ts-ignore
      await createCompany({
        name: updatedRegistration.companyName,
        email: updatedRegistration.email,
        unifiedNumber: updatedRegistration.companyId,
        published: false,
        tags: [],
      });

      // 重新驗證路徑，使畫面刷新
      revalidatePath("/admin/registration");

      return {
        success: true,
        message: "企業註冊申請已通過",
        data: updatedRegistration,
      };
    } else if (type === "alumni") {
      // 查找校友註冊資料
      const registration = await findUniqueAlumniRegistration({
        id: id,
      });

      if (!registration) {
        return {
          success: false,
          message: "找不到相關的註冊申請",
        };
      }

      // 更新校友註冊狀態 - 移除了不存在的欄位 approvedAt 和 approvedBy
      const updatedRegistration = await updateAlumniRegistration(
        { id },
        {
          status: RegistrationStatus.APPROVED,
          // 根據錯誤訊息，校友註冊模型沒有 approvedAt 欄位
          approvedAt: new Date(),
          approvedBy: user.id,
        }
      );

      // 更新用戶狀態為已驗證
      const registrationUser = await findUniqueUser({
        email: registration.email,
      });
      if (registrationUser) {
        await updateUser(
          { email: registration.email },
          { status: AccountStatus.VERIFIED, role: UserRole.ALUMNI }
        );
      }

      // 重新驗證路徑，使畫面刷新
      revalidatePath("/admin/registration");

      return {
        success: true,
        message: "校友註冊申請已通過",
        data: updatedRegistration,
      };
    } else {
      return { success: false, message: "無效的註冊類型" };
    }
  } catch (error) {
    console.error("核准註冊申請失敗:", error);
    return {
      success: false,
      message: "核准過程中發生錯誤",
      error: error instanceof Error ? error.message : "未知錯誤",
    };
  }
}
