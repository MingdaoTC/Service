"use client";

import {
  Shield,
  UserCheck,
  Crown,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { useCallback, useEffect, useState, useMemo } from "react";

// Server Actions
import {
  getAdminsData,
  promoteToAdmin,
  demoteFromAdmin,
  promoteToSuperAdmin,
  demoteFromSuperAdmin,
} from "@/app/(manage)/admin/admins/_admins/action/adminAction";

import { AccountStatus, UserRole, User as UserType } from "@/prisma/client";

interface AdminActionResult {
  success: boolean;
  message: string;
  data?: UserType[];
}

export default function AdminManagementPage() {
  // 主要狀態
  const [allAdmins, setAllAdmins] = useState<UserType[]>([]); // 儲存所有管理員資料
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 載入管理員數據
  const loadAdmins = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("statusFilter", "all");
      formData.append("roleFilter", "all");
      formData.append("searchQuery", "");

      const result = await getAdminsData(formData);

      if (result.success && result.data) {
        const dataArray = Array.isArray(result.data) ? result.data : [result.data];
        const adminUsers = dataArray.filter(
          (user: UserType) => user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN
        );
        setAllAdmins(adminUsers);
      } else {
        setError(result.message || "載入管理員數據失敗");
      }
    } catch (error) {
      console.error("Error loading admins:", error);
      setError("載入管理員數據時發生錯誤");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 載入數據
  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  // 處理查看詳情
  const handleView = (id: string) => {
    setSelectedId(id === selectedId ? null : id);
  };

  // 處理提升為管理員
  const handlePromoteToAdmin = async (userId: string) => {
    if (!confirm("確定要將此用戶提升為管理員嗎？")) return;

    setActionLoading(userId);
    try {
      const result = await promoteToAdmin(userId);
      if (result.success) {
        await loadAdmins(); // 重新載入數據
        alert("成功提升為管理員");
      } else {
        alert(result.message || "操作失敗");
      }
    } catch (error) {
      console.error("Error promoting to admin:", error);
      alert("操作時發生錯誤");
    } finally {
      setActionLoading(null);
    }
  };

  // 處理降級管理員
  const handleDemoteFromAdmin = async (userId: string) => {
    if (!confirm("確定要將此管理員降級為一般用戶嗎？")) return;

    setActionLoading(userId);
    try {
      const result = await demoteFromAdmin(userId);
      if (result.success) {
        await loadAdmins(); // 重新載入數據
        alert("成功降級管理員");
      } else {
        alert(result.message || "操作失敗");
      }
    } catch (error) {
      console.error("Error demoting from admin:", error);
      alert("操作時發生錯誤");
    } finally {
      setActionLoading(null);
    }
  };

  // 處理提升為超級管理員
  const handlePromoteToSuperAdmin = async (userId: string) => {
    if (!confirm("確定要將此管理員提升為超級管理員嗎？這將賦予最高權限！")) return;

    setActionLoading(userId);
    try {
      const result = await promoteToSuperAdmin(userId);
      if (result.success) {
        await loadAdmins(); // 重新載入數據
        alert("成功提升為超級管理員");
      } else {
        alert(result.message || "操作失敗");
      }
    } catch (error) {
      console.error("Error promoting to super admin:", error);
      alert("操作時發生錯誤");
    } finally {
      setActionLoading(null);
    }
  };

  // 處理降級超級管理員
  const handleDemoteFromSuperAdmin = async (userId: string) => {
    if (!confirm("確定要將此超級管理員降級為一般管理員嗎？")) return;

    setActionLoading(userId);
    try {
      const result = await demoteFromSuperAdmin(userId);
      if (result.success) {
        await loadAdmins(); // 重新載入數據
        alert("成功降級為管理員");
      } else {
        alert(result.message || "操作失敗");
      }
    } catch (error) {
      console.error("Error demoting from super admin:", error);
      alert("操作時發生錯誤");
    } finally {
      setActionLoading(null);
    }
  };

  // 計算統計數據
  const superAdmins = allAdmins.filter((u) => u.role === UserRole.SUPERADMIN).length;
  const regularAdmins = allAdmins.filter((u) => u.role === UserRole.ADMIN).length;

  // 輔助函數
  const getStatusText = (status: string) => {
    switch (status) {
      case "VERIFIED": return "已驗證";
      case "PENDING": return "待驗證";
      case "UNVERIFIED": return "未驗證";
      default: return status;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "SUPERADMIN": return "超級管理員";
      case "ADMIN": return "管理員";
      default: return role;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatDateTime = (date: Date | string) => {
    return new Date(date).toLocaleString("zh-TW");
  };

  // 載入中狀態
  if (isLoading) {
    return (
      <div className="bg-blue-50 flex items-center justify-center h-[calc(100dvh-3rem)]">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            載入中...
          </span>
        </div>
      </div>
    );
  }

  // 錯誤狀態
  if (error) {
    return (
      <div className="w-full mx-auto h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">權限錯誤</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            重新載入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto min-h-screen p-2 sm:p-4 lg:p-6">

      {/* 頁面標題 */}
      <div className="mb-4 sm:mb-6 bg-white shadow-sm rounded-lg border p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-blue-600 flex items-center">
              <Crown className="h-6 w-6 mr-2 text-yellow-500" />
              管理員管理
            </h1>
            <p className="text-sm text-gray-500 mt-1">僅限超級管理員訪問</p>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="text-sm text-red-600 font-medium">高權限區域</span>
          </div>
        </div>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">

        {/* 一般管理員 */}
        <div className="bg-white shadow-sm rounded-lg border p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                一般管理員
              </p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-purple-600">
                {regularAdmins.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                管理權限
              </p>
            </div>
            <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
              <UserCheck className="text-purple-600 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </div>
          </div>
        </div>

        {/* 超級管理員 */}
        <div className="bg-white shadow-sm rounded-lg border p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                超級管理員
              </p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-red-600">
                {superAdmins.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                最高權限
              </p>
            </div>
            <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
              <Crown className="text-red-600 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* 管理員列表 */}
      <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
        {/* 桌面版表頭 */}
        <div className="hidden lg:block p-4 bg-gray-50 border-b">
          <div className="grid grid-cols-5 text-sm font-medium text-gray-600">
            <div className="col-span-2 text-left">管理員資訊</div>
            <div className="col-span-1 text-center">級別</div>
            <div className="col-span-1 text-center">驗證狀態</div>
            <div className="col-span-1 text-center">加入日期</div>
          </div>
        </div>

        <div className="divide-y">
          {/* 空狀態 */}
          {allAdmins.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-500">
              <Settings className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm">無符合條件的管理員</p>
            </div>
          )}

          {/* 管理員列表項目 */}
          {allAdmins.map((admin) => (
            <div
              key={admin.id}
              className="hover:bg-gray-50 transition-colors"
            >
              {/* 桌面版顯示 */}
              <div className="hidden lg:block px-4 py-3">
                <div className="grid grid-cols-5 text-sm items-center">
                  <div className="col-span-2 flex items-center">
                    <div className="flex items-center">
                      {/* 頭像 */}
                      {admin.avatarUrl ? (
                        <img
                          src={admin.avatarUrl}
                          alt={`${admin.displayName || admin.username} 的頭像`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          {admin.role === UserRole.SUPERADMIN ? (
                            <Crown className="h-6 w-6 text-red-500" />
                          ) : (
                            <Shield className="h-6 w-6 text-purple-500" />
                          )}
                        </div>
                      )}
                      <div className="ml-3 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {admin.displayName || admin.username}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {admin.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${admin.role === UserRole.SUPERADMIN
                      ? "bg-red-100 text-red-800"
                      : "bg-purple-100 text-purple-800"
                      }`}>
                      {getRoleText(admin.role)}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${admin.status === "VERIFIED"
                        ? "bg-green-100 text-green-800"
                        : admin.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {getStatusText(admin.status)}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="text-gray-500">
                      {formatDate(admin.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 手機版顯示 */}
              <div className="lg:hidden px-3 sm:px-4 py-3">
                <div className="flex items-start space-x-3">
                  {/* 頭像 */}
                  {admin.avatarUrl ? (
                    <div className="flex-shrink-0">
                      <img
                        src={admin.avatarUrl}
                        alt={`${admin.displayName || admin.username} 的頭像`}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-200 flex items-center justify-center">
                        {admin.role === UserRole.SUPERADMIN ? (
                          <Crown className="h-6 w-6 sm:h-7 sm:w-7 text-red-500" />
                        ) : (
                          <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-purple-500" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* 內容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                          {admin.displayName || admin.username}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">
                          {admin.email}
                        </p>
                      </div>
                      {/* 狀態標籤 */}
                      <div className="flex flex-col items-end space-y-1 ml-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${admin.role === UserRole.SUPERADMIN
                          ? "bg-red-100 text-red-800"
                          : "bg-purple-100 text-purple-800"
                          }`}>
                          {getRoleText(admin.role)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 警告提示 */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">
              重要安全提醒
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>超級管理員擁有系統最高權限，請謹慎授予</li>
                <li>降級操作將立即生效，請確認後再執行</li>
                <li>建議定期審核管理員權限，確保帳戶安全</li>
                <li>所有管理員操作都會被記錄在系統日誌中</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 底部間距 */}
      <div className="mt-6" />
    </div>
  );
}