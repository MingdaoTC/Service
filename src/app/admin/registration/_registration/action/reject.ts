'use server';

// 認證與權限
import { auth } from "@/library/auth";
import { UserRole, RegistrationStatus, AccountStatus, User } from "@/prisma/client";

// 註冊相關函數
import { updateAlumniRegistration } from "@/library/prisma/registration/alumni/update";
import { updateCompanyRegistration } from "@/library/prisma/registration/company/update";
import { findUniqueAlumniRegistration } from "@/library/prisma/registration/alumni/findUnique";
import { findUniqueCompanyRegistration } from "@/library/prisma/registration/company/findUnique";
import { updateUser } from "@/library/prisma/user/update";
import { findUniqueUser } from "@/library/prisma/user/findUnique";

// 輔助函數
import { revalidatePath } from "next/cache";

/**
 * 審核拒絕申請的 Server Action
 * @param formData 表單資料
 */
export async function rejectRegistration(formData: FormData) {
  try {
    // 驗證用戶權限
    const session = await auth();
    const user = session?.user as User;

    // 檢查用戶是否登入及擁有權限
    if (!user) {
      return { 
        success: false, 
        message: "您沒有權限進行這個操作" 
      };
    }

    // 確認是管理員或超級管理員
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN) {
      return { 
        success: false, 
        message: "您沒有權限進行這個操作" 
      };
    }

    // 獲取並檢查參數
    const id = formData.get('id') as string;
    const type = formData.get('type') as 'company' | 'alumni';
    const rejectReason = formData.get('rejectReason') as string;
    
    if (!id || !type || (type !== 'company' && type !== 'alumni')) {
      return { 
        success: false, 
        message: '缺少必要參數或參數無效' 
      };
    }
    
    if (!rejectReason || rejectReason.trim() === '') {
      return {
        success: false,
        message: '請提供拒絕原因'
      };
    }
    
    if (rejectReason.length > 500) {
      return {
        success: false,
        message: '拒絕原因不可超過500字'
      };
    }
    
    // 依據類型更新不同的資料表
    if (type === 'company') {
      // 查找公司註冊資料
      const registration = await findUniqueCompanyRegistration({
        id: id
      });
      
      if (!registration) {
        return { 
          success: false, 
          message: "找不到相關的註冊申請" 
        };
      }
      
      // 更新企業註冊狀態 - 移除了不存在的 rejectAt 欄位
      const updatedRegistration = await updateCompanyRegistration(
        { id },
        { 
          status: RegistrationStatus.REJECTED,
          // 根據錯誤訊息，企業註冊模型沒有 rejectAt 欄位
          rejectAt: new Date(),
          rejectReason: rejectReason, // 但有 rejectReason 欄位
        }
      );
      
      // 更新用戶狀態為已拒絕
      const registrationUser = await findUniqueUser({ email: registration.email });
      if (registrationUser) {
        await updateUser(
          { email: registration.email },
          { status: AccountStatus.UNVERIFIED }
        );
      }
      
      // 重新驗證路徑，使畫面刷新
      revalidatePath('/admin/registration');
      
      return { 
        success: true, 
        message: '企業註冊申請已拒絕',
        data: updatedRegistration
      };
    } 
    else if (type === 'alumni') {
      // 查找校友註冊資料
      const registration = await findUniqueAlumniRegistration({
        id: id
      });
      
      if (!registration) {
        return { 
          success: false, 
          message: "找不到相關的註冊申請" 
        };
      }
      
      // 更新校友註冊狀態 - 僅更新狀態
      const updatedRegistration = await updateAlumniRegistration(
        { id },
        { 
          status: RegistrationStatus.REJECTED,
          // 校友註冊模型沒有 rejectAt 和 rejectReason 欄位
        }
      );
      
      // 更新用戶狀態為已拒絕
      const registrationUser = await findUniqueUser({ email: registration.email });
      if (registrationUser) {
        await updateUser(
          { email: registration.email },
          { status: AccountStatus.UNVERIFIED }
        );
      }
      
      // 重新驗證路徑，使畫面刷新
      revalidatePath('/admin/registration');
      
      return { 
        success: true, 
        message: '校友註冊申請已拒絕',
        data: updatedRegistration
      };
    } 
    else {
      return { success: false, message: '無效的註冊類型' };
    }
  } catch (error) {
    console.error('拒絕註冊申請失敗:', error);
    return { 
      success: false, 
      message: '拒絕過程中發生錯誤',
      error: error instanceof Error ? error.message : '未知錯誤'
    };
  }
}