"use server";

import { prisma } from "@/library/prisma";
import { auth } from "@/library/auth";
import { UserRole, AccountStatus, User } from "@/prisma/client";
import { revalidatePath } from "next/cache";

// 返回類型定義
interface ActionResult {
  success: boolean;
  message: string;
  data?: User[] | User;
}

// 驗證當前用戶是否為超級管理員
async function validateSuperAdmin(): Promise<{
  success: boolean;
  userId?: string;
  message?: string;
}> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "未授權訪問",
    };
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, status: true },
  });

  if (
    !currentUser ||
    currentUser.role !== UserRole.SUPERADMIN ||
    currentUser.status !== AccountStatus.VERIFIED
  ) {
    return {
      success: false,
      message: "只有被授權的超級管理員可以查看此頁面",
    };
  }

  return {
    success: true,
    userId: session.user.id,
  };
}

// 獲取管理員數據
export async function getAdminsData(formData: FormData): Promise<ActionResult> {
  try {
    // 驗證權限
    const validation = await validateSuperAdmin();
    if (!validation.success) {
      return {
        success: false,
        message: validation.message || "權限驗證失敗",
      };
    }

    const statusFilter = formData.get("statusFilter") as string;
    const roleFilter = formData.get("roleFilter") as string;
    const searchQuery = formData.get("searchQuery") as string;

    // 構建查詢條件
    const whereConditions: any = {
      // 只查詢管理員和超級管理員
      role: {
        in: [UserRole.ADMIN, UserRole.SUPERADMIN],
      },
    };

    // 狀態篩選
    if (statusFilter && statusFilter !== "all") {
      whereConditions.status = statusFilter.toUpperCase() as AccountStatus;
    }

    // 角色篩選
    if (roleFilter && roleFilter !== "all") {
      whereConditions.role = roleFilter as UserRole;
    }

    // 搜尋條件
    if (searchQuery && searchQuery.trim() !== "") {
      const searchTerm = searchQuery.trim();
      whereConditions.OR = [
        {
          username: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          displayName: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ];
    }

    const admins = await prisma.user.findMany({
      where: whereConditions,
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        { role: "desc" }, // SUPERADMIN 在前
        { createdAt: "desc" },
      ],
    });

    return {
      success: true,
      message: "成功獲取管理員數據",
      data: admins,
    };
  } catch (error) {
    console.error("Error fetching admins data:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "獲取管理員數據失敗",
    };
  }
}

// 根據電子郵件新增管理員
export async function addAdminByEmail(
  formData: FormData
): Promise<ActionResult> {
  try {
    // 驗證權限
    const validation = await validateSuperAdmin();
    if (!validation.success) {
      return {
        success: false,
        message: validation.message || "權限驗證失敗",
      };
    }

    const currentUserId = validation.userId!;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;

    // 驗證輸入
    if (!email || !email.trim()) {
      return {
        success: false,
        message: "請輸入電子郵件地址",
      };
    }

    if (!email.includes("@")) {
      return {
        success: false,
        message: "請輸入有效的電子郵件地址",
      };
    }

    if (!role || (role !== "ADMIN" && role !== "SUPERADMIN")) {
      return {
        success: false,
        message: "請選擇有效的管理員類型",
      };
    }

    // 查找用戶
    const targetUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!targetUser) {
      return {
        success: false,
        message: "找不到該電子郵件對應的用戶，請確認用戶已註冊",
      };
    }

    // 檢查用戶狀態
    if (targetUser.status !== AccountStatus.VERIFIED) {
      return {
        success: false,
        message: "只能提升已驗證的用戶為管理員",
      };
    }

    // 檢查是否已經是管理員或更高權限
    if (
      targetUser.role === UserRole.ADMIN ||
      targetUser.role === UserRole.SUPERADMIN
    ) {
      return {
        success: false,
        message: "該用戶已經是管理員或更高權限",
      };
    }

    // 更新用戶角色
    const updatedUser = await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        role: role as UserRole,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true,
        displayName: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // 記錄操作日誌
    await prisma.adminLog
      .create({
        data: {
          adminId: currentUserId,
          action: role === "SUPERADMIN" ? "ADD_SUPERADMIN" : "ADD_ADMIN",
          targetUserId: targetUser.id,
          details: `新增${role === "SUPERADMIN" ? "超級管理員" : "管理員"} ${
            targetUser.username
          } (${targetUser.email})`,
          createdAt: new Date(),
        },
      })
      .catch(() => {
        // 如果沒有 adminLog 表，忽略錯誤
      });

    // 重新驗證相關頁面
    revalidatePath("/admin/admins");
    revalidatePath("/admin/users");

    return {
      success: true,
      message: `成功新增${role === "SUPERADMIN" ? "超級管理員" : "管理員"}`,
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error adding admin by email:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "新增管理員失敗",
    };
  }
}

// 根據電子郵件移除管理員
export async function removeAdminByEmail(
  formData: FormData
): Promise<ActionResult> {
  try {
    // 驗證權限
    const validation = await validateSuperAdmin();
    if (!validation.success) {
      return {
        success: false,
        message: validation.message || "權限驗證失敗",
      };
    }

    const currentUserId = validation.userId!;
    const email = formData.get("email") as string;

    // 驗證輸入
    if (!email || !email.trim()) {
      return {
        success: false,
        message: "請輸入電子郵件地址",
      };
    }

    if (!email.includes("@")) {
      return {
        success: false,
        message: "請輸入有效的電子郵件地址",
      };
    }

    // 查找要移除的管理員
    const targetAdmin = await prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase(),
        role: {
          in: [UserRole.ADMIN, UserRole.SUPERADMIN],
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    if (!targetAdmin) {
      return {
        success: false,
        message: "找不到該電子郵件對應的管理員",
      };
    }

    // 防止自己移除自己
    if (targetAdmin.id === currentUserId) {
      return {
        success: false,
        message: "不能移除自己的管理員權限",
      };
    }

    // 如果是超級管理員，檢查系統中是否還有其他超級管理員
    if (targetAdmin.role === UserRole.SUPERADMIN) {
      const otherSuperAdminCount = await prisma.user.count({
        where: {
          role: UserRole.SUPERADMIN,
          status: AccountStatus.VERIFIED,
          id: { not: targetAdmin.id },
        },
      });

      if (otherSuperAdminCount === 0) {
        return {
          success: false,
          message: "系統至少需要保留一個超級管理員",
        };
      }
    }

    // 更新用戶角色為校友（或根據業務邏輯決定降級後的角色）
    const updatedUser = await prisma.user.update({
      where: { id: targetAdmin.id },
      data: {
        role: UserRole.ALUMNI, // 或其他適當的角色
        updatedAt: new Date(),
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true,
        displayName: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // 記錄操作日誌
    await prisma.adminLog
      .create({
        data: {
          adminId: currentUserId,
          action: "REMOVE_ADMIN",
          targetUserId: targetAdmin.id,
          details: `移除管理員 ${targetAdmin.username} (${targetAdmin.email}) 的權限`,
          createdAt: new Date(),
        },
      })
      .catch(() => {
        // 如果沒有 adminLog 表，忽略錯誤
      });

    // 重新驗證相關頁面
    revalidatePath("/admin/admins");
    revalidatePath("/admin/users");

    return {
      success: true,
      message: `成功移除 ${targetAdmin.username} 的管理員權限`,
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error removing admin by email:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "移除管理員失敗",
    };
  }
}

// 提升為管理員
export async function promoteToAdmin(userId: string): Promise<ActionResult> {
  try {
    // 驗證權限
    const validation = await validateSuperAdmin();
    if (!validation.success) {
      return {
        success: false,
        message: validation.message || "權限驗證失敗",
      };
    }

    const currentUserId = validation.userId!;

    if (!userId) {
      return {
        success: false,
        message: "用戶ID不能為空",
      };
    }

    // 檢查目標用戶是否存在
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!targetUser) {
      return {
        success: false,
        message: "找不到指定的用戶",
      };
    }

    // 檢查用戶狀態
    if (targetUser.status !== AccountStatus.VERIFIED) {
      return {
        success: false,
        message: "只能提升已驗證的用戶為管理員",
      };
    }

    // 檢查是否已經是管理員或更高權限
    if (
      targetUser.role === UserRole.ADMIN ||
      targetUser.role === UserRole.SUPERADMIN
    ) {
      return {
        success: false,
        message: "該用戶已經是管理員或更高權限",
      };
    }

    // 更新用戶角色
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: UserRole.ADMIN,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true,
        displayName: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // 記錄操作日誌（可選）
    await prisma.adminLog
      .create({
        data: {
          adminId: currentUserId,
          action: "PROMOTE_TO_ADMIN",
          targetUserId: userId,
          details: `提升用戶 ${targetUser.username} (${targetUser.email}) 為管理員`,
          createdAt: new Date(),
        },
      })
      .catch(() => {
        // 如果沒有 adminLog 表，忽略錯誤
      });

    // 重新驗證相關頁面
    revalidatePath("/admin/admins");
    revalidatePath("/admin/users");

    return {
      success: true,
      message: `成功將 ${targetUser.username} 提升為管理員`,
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error promoting to admin:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "提升管理員失敗",
    };
  }
}

// 降級管理員
export async function demoteFromAdmin(userId: string): Promise<ActionResult> {
  try {
    // 驗證權限
    const validation = await validateSuperAdmin();
    if (!validation.success) {
      return {
        success: false,
        message: validation.message || "權限驗證失敗",
      };
    }

    const currentUserId = validation.userId!;

    if (!userId) {
      return {
        success: false,
        message: "用戶ID不能為空",
      };
    }

    // 防止自己降級自己
    if (userId === currentUserId) {
      return {
        success: false,
        message: "不能降級自己的權限",
      };
    }

    // 檢查目標用戶是否存在
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    if (!targetUser) {
      return {
        success: false,
        message: "找不到指定的用戶",
      };
    }

    // 檢查是否為管理員
    if (targetUser.role !== UserRole.ADMIN) {
      return {
        success: false,
        message: "該用戶不是管理員",
      };
    }

    // 檢查系統中是否還有其他超級管理員
    const superAdminCount = await prisma.user.count({
      where: {
        role: UserRole.SUPERADMIN,
        status: AccountStatus.VERIFIED,
        id: { not: userId },
      },
    });

    if (superAdminCount === 0) {
      return {
        success: false,
        message: "系統至少需要保留一個超級管理員",
      };
    }

    // 更新用戶角色為校友（或根據業務邏輯決定降級後的角色）
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: UserRole.ALUMNI, // 或其他適當的角色
        updatedAt: new Date(),
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true,
        displayName: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // 記錄操作日誌
    await prisma.adminLog
      .create({
        data: {
          adminId: currentUserId,
          action: "DEMOTE_FROM_ADMIN",
          targetUserId: userId,
          details: `降級管理員 ${targetUser.username} (${targetUser.email}) 為一般用戶`,
          createdAt: new Date(),
        },
      })
      .catch(() => {
        // 如果沒有 adminLog 表，忽略錯誤
      });

    // 重新驗證相關頁面
    revalidatePath("/admin/admins");
    revalidatePath("/admin/users");

    return {
      success: true,
      message: `成功降級 ${targetUser.username} 為一般用戶`,
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error demoting from admin:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "降級管理員失敗",
    };
  }
}

// 提升為超級管理員
export async function promoteToSuperAdmin(
  userId: string
): Promise<ActionResult> {
  try {
    // 驗證權限
    const validation = await validateSuperAdmin();
    if (!validation.success) {
      return {
        success: false,
        message: validation.message || "權限驗證失敗",
      };
    }

    const currentUserId = validation.userId!;

    if (!userId) {
      return {
        success: false,
        message: "用戶ID不能為空",
      };
    }

    // 檢查目標用戶是否存在
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!targetUser) {
      return {
        success: false,
        message: "找不到指定的用戶",
      };
    }

    // 檢查用戶狀態
    if (targetUser.status !== AccountStatus.VERIFIED) {
      return {
        success: false,
        message: "只能提升已驗證的用戶為超級管理員",
      };
    }

    // 檢查是否為管理員
    if (targetUser.role !== UserRole.ADMIN) {
      return {
        success: false,
        message: "只能將管理員提升為超級管理員",
      };
    }

    // 更新用戶角色
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: UserRole.SUPERADMIN,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true,
        displayName: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // 記錄操作日誌
    await prisma.adminLog
      .create({
        data: {
          adminId: currentUserId,
          action: "PROMOTE_TO_SUPERADMIN",
          targetUserId: userId,
          details: `提升管理員 ${targetUser.email} (${targetUser.id}) 為超級管理員`,
          createdAt: new Date(),
        },
      })
      .catch(() => {
        // 如果沒有 adminLog 表，忽略錯誤
      });

    // 重新驗證相關頁面
    revalidatePath("/admin/admins");
    revalidatePath("/admin/users");

    return {
      success: true,
      message: `成功將 ${targetUser.email} 提升為超級管理員`,
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error promoting to super admin:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "提升超級管理員失敗",
    };
  }
}

// 降級超級管理員
export async function demoteFromSuperAdmin(
  userId: string
): Promise<ActionResult> {
  try {
    // 驗證權限
    const validation = await validateSuperAdmin();
    if (!validation.success) {
      return {
        success: false,
        message: validation.message || "權限驗證失敗",
      };
    }

    const currentUserId = validation.userId!;

    if (!userId) {
      return {
        success: false,
        message: "用戶ID不能為空",
      };
    }

    // 防止自己降級自己
    if (userId === currentUserId) {
      return {
        success: false,
        message: "不能降級自己的權限",
      };
    }

    // 檢查目標用戶是否存在
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    if (!targetUser) {
      return {
        success: false,
        message: "找不到指定的用戶",
      };
    }

    // 檢查是否為超級管理員
    if (targetUser.role !== UserRole.SUPERADMIN) {
      return {
        success: false,
        message: "該用戶不是超級管理員",
      };
    }

    // 檢查系統中是否還有其他超級管理員
    const otherSuperAdminCount = await prisma.user.count({
      where: {
        role: UserRole.SUPERADMIN,
        status: AccountStatus.VERIFIED,
        id: { not: userId },
      },
    });

    if (otherSuperAdminCount === 0) {
      return {
        success: false,
        message: "系統至少需要保留一個超級管理員",
      };
    }

    // 更新用戶角色
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: UserRole.ADMIN,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true,
        displayName: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // 記錄操作日誌
    await prisma.adminLog
      .create({
        data: {
          adminId: currentUserId,
          action: "DEMOTE_FROM_SUPERADMIN",
          targetUserId: userId,
          details: `降級超級管理員 ${targetUser.username} (${targetUser.email}) 為管理員`,
          createdAt: new Date(),
        },
      })
      .catch(() => {
        // 如果沒有 adminLog 表，忽略錯誤
      });

    // 重新驗證相關頁面
    revalidatePath("/admin/admins");
    revalidatePath("/admin/users");

    return {
      success: true,
      message: `成功將 ${targetUser.username} 降級為管理員`,
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error demoting from super admin:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "降級超級管理員失敗",
    };
  }
}

// 批量操作：提升多個用戶為管理員
export async function batchPromoteToAdmin(
  userIds: string[]
): Promise<ActionResult> {
  try {
    // 驗證權限
    const validation = await validateSuperAdmin();
    if (!validation.success) {
      return {
        success: false,
        message: validation.message || "權限驗證失敗",
      };
    }

    const currentUserId = validation.userId!;

    if (!userIds || userIds.length === 0) {
      return {
        success: false,
        message: "請選擇要提升的用戶",
      };
    }

    // 檢查所有目標用戶
    const targetUsers = await prisma.user.findMany({
      where: {
        id: { in: userIds },
        status: AccountStatus.VERIFIED,
        role: { notIn: [UserRole.ADMIN, UserRole.SUPERADMIN] },
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    if (targetUsers.length === 0) {
      return {
        success: false,
        message: "沒有符合條件的用戶可以提升",
      };
    }

    // 批量更新
    const updateResult = await prisma.user.updateMany({
      where: {
        id: { in: targetUsers.map((user) => user.id) },
      },
      data: {
        role: UserRole.ADMIN,
        updatedAt: new Date(),
      },
    });

    // 記錄操作日誌
    for (const user of targetUsers) {
      await prisma.adminLog
        .create({
          data: {
            adminId: currentUserId,
            action: "BATCH_PROMOTE_TO_ADMIN",
            targetUserId: user.id,
            details: `批量提升用戶 ${user.username} (${user.email}) 為管理員`,
            createdAt: new Date(),
          },
        })
        .catch(() => {
          // 如果沒有 adminLog 表，忽略錯誤
        });
    }

    // 重新驗證相關頁面
    revalidatePath("/admin/admins");
    revalidatePath("/admin/users");

    return {
      success: true,
      message: `成功批量提升 ${updateResult.count} 位用戶為管理員`,
    };
  } catch (error) {
    console.error("Error batch promoting to admin:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "批量提升管理員失敗",
    };
  }
}
