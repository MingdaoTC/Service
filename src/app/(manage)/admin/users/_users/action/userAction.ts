// app/(manage)/admin/users/_actions/userActions.ts
"use server";

import { auth } from "@/library/auth";
import { User, UserRole, AccountStatus } from "@/prisma/client";
import { findUniqueUser } from "@/library/prisma/user/findUnique";
import { updateUser } from "@/library/prisma/user/update";
import { findManyUser } from "@/library/prisma/user/findMany";
import { revalidatePath } from "next/cache";

/**
 * 獲取使用者列表 Server Action
 */
export async function getUsersData(formData: FormData) {
  try {
    // 驗證用戶權限
    const session = await auth();
    const user = session?.user as User;

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

    // 獲取篩選參數
    const statusFilter = formData.get("statusFilter") as string;
    const roleFilter = formData.get("roleFilter") as string;
    const activeFilter = formData.get("activeFilter") as string;
    const searchQuery = formData.get("searchQuery") as string;
    const searchType = formData.get("searchType") as string;

    // 構建查詢條件
    const where: any = {};

    // 狀態篩選
    if (statusFilter && statusFilter !== "all") {
      switch (statusFilter) {
        case "verified":
          where.status = AccountStatus.VERIFIED;
          break;
        case "pending":
          where.status = AccountStatus.PENDING;
          break;
        case "rejected":
          where.status = AccountStatus.UNVERIFIED;
          break;
      }
    }

    // 角色篩選
    if (roleFilter && roleFilter !== "all") {
      switch (roleFilter) {
        case "guest":
          where.role = UserRole.GUEST;
          break;
        case "alumni":
          where.role = UserRole.ALUMNI;
          break;
        case "company":
          where.role = UserRole.COMPANY;
          break;
        case "admin":
          where.role = UserRole.ADMIN;
          break;
        case "super_admin":
          where.role = UserRole.SUPERADMIN;
          break;
      }
    }

    // 啟用狀態篩選
    if (activeFilter && activeFilter !== "all") {
      where.isActive = activeFilter === "active";
    }

    // 搜尋條件
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();

      if (searchType === "username") {
        where.username = { contains: query, mode: "insensitive" };
      } else if (searchType === "email") {
        where.email = { contains: query, mode: "insensitive" };
      } else if (searchType === "displayName") {
        where.displayName = { contains: query, mode: "insensitive" };
      } else {
        // 全部搜尋
        where.OR = [
          { username: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { displayName: { contains: query, mode: "insensitive" } },
          { phone: { contains: query, mode: "insensitive" } },
        ];
      }
    }

    // 查詢使用者資料
    const users = await findManyUser();

    return {
      success: true,
      data: users,
    };
  } catch (error) {
    console.error("獲取使用者資料失敗:", error);
    return {
      success: false,
      message: "獲取使用者資料時發生錯誤",
      error: error instanceof Error ? error.message : "未知錯誤",
    };
  }
}

/**
 * 更新使用者狀態 Server Action
 */
export async function updateUserStatus(formData: FormData) {
  try {
    // 驗證用戶權限
    const session = await auth();
    const user = session?.user as User;

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

    // 獲取參數
    const userId = formData.get("userId") as string;
    const status = formData.get("status") as AccountStatus;

    if (!userId || !status) {
      return {
        success: false,
        message: "缺少必要參數",
      };
    }

    // 檢查目標使用者是否存在
    const targetUser = await findUniqueUser({ id: userId });
    if (!targetUser) {
      return {
        success: false,
        message: "找不到指定的使用者",
      };
    }

    // 防止修改超級管理員
    if (
      targetUser.role === UserRole.SUPERADMIN &&
      user.role !== UserRole.SUPERADMIN
    ) {
      return {
        success: false,
        message: "您無權修改超級管理員的狀態",
      };
    }

    // 更新使用者狀態
    const updatedUser = await updateUser(
      { id: userId },
      {
        status,
        updatedAt: new Date(),
      }
    );

    // 重新驗證路徑
    revalidatePath("/admin/users");

    return {
      success: true,
      message: "使用者狀態更新成功",
      data: updatedUser,
    };
  } catch (error) {
    console.error("更新使用者狀態失敗:", error);
    return {
      success: false,
      message: "更新使用者狀態時發生錯誤",
      error: error instanceof Error ? error.message : "未知錯誤",
    };
  }
}

/**
 * 更新使用者角色 Server Action
 */
export async function updateUserRole(formData: FormData) {
  try {
    // 驗證用戶權限
    const session = await auth();
    const user = session?.user as User;

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

    // 獲取參數
    const userId = formData.get("userId") as string;
    const role = formData.get("role") as UserRole;

    if (!userId || !role) {
      return {
        success: false,
        message: "缺少必要參數",
      };
    }

    // 檢查目標使用者是否存在
    const targetUser = await findUniqueUser({ id: userId });
    if (!targetUser) {
      return {
        success: false,
        message: "找不到指定的使用者",
      };
    }

    // 防止修改超級管理員
    if (targetUser.role === UserRole.SUPERADMIN) {
      return {
        success: false,
        message: "無法修改超級管理員的角色",
      };
    }

    // 只有超級管理員可以設置超級管理員
    if (role === UserRole.SUPERADMIN && user.role !== UserRole.SUPERADMIN) {
      return {
        success: false,
        message: "只有超級管理員可以設置超級管理員角色",
      };
    }

    // 防止一般管理員降級其他管理員
    if (
      targetUser.role === UserRole.ADMIN &&
      user.role === UserRole.ADMIN &&
      role !== UserRole.ADMIN
    ) {
      return {
        success: false,
        message: "您無權修改其他管理員的角色",
      };
    }

    // 更新使用者角色
    const updatedUser = await updateUser(
      { id: userId },
      {
        role,
        updatedAt: new Date(),
      }
    );

    // 重新驗證路徑
    revalidatePath("/admin/users");

    return {
      success: true,
      message: "使用者角色更新成功",
      data: updatedUser,
    };
  } catch (error) {
    console.error("更新使用者角色失敗:", error);
    return {
      success: false,
      message: "更新使用者角色時發生錯誤",
      error: error instanceof Error ? error.message : "未知錯誤",
    };
  }
}

/**
 * 更新使用者啟用狀態 Server Action
 */
export async function updateUserActiveStatus(formData: FormData) {
  try {
    // 驗證用戶權限
    const session = await auth();
    const user = session?.user as User;

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

    // 獲取參數
    const userId = formData.get("userId") as string;
    const isActive = formData.get("isActive") === "true";

    if (!userId) {
      return {
        success: false,
        message: "缺少必要參數",
      };
    }

    // 檢查目標使用者是否存在
    const targetUser = await findUniqueUser({ id: userId });
    if (!targetUser) {
      return {
        success: false,
        message: "找不到指定的使用者",
      };
    }

    // 防止停用超級管理員
    if (targetUser.role === UserRole.SUPERADMIN && !isActive) {
      return {
        success: false,
        message: "無法停用超級管理員",
      };
    }

    // 防止停用自己
    if (targetUser.id === user.id && !isActive) {
      return {
        success: false,
        message: "無法停用自己的帳號",
      };
    }

    // 更新使用者啟用狀態
    const updatedUser = await updateUser(
      { id: userId },
      {
        updatedAt: new Date(),
      }
    );

    // 重新驗證路徑
    revalidatePath("/admin/users");

    return {
      success: true,
      message: `使用者已${isActive ? "啟用" : "停用"}`,
      data: updatedUser,
    };
  } catch (error) {
    console.error("更新使用者啟用狀態失敗:", error);
    return {
      success: false,
      message: "更新使用者啟用狀態時發生錯誤",
      error: error instanceof Error ? error.message : "未知錯誤",
    };
  }
}
