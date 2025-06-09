"use client";

import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Crown,
  Mail,
  Settings,
  Shield,
  UserCheck,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// Server Actions
import {
  addAdminByEmail,
  demoteFromAdmin,
  demoteFromSuperAdmin,
  getAdminsData,
  promoteToAdmin,
  promoteToSuperAdmin,
  removeAdminByEmail,
} from "@/app/(manage)/admin/admins/_admins/action/adminAction";

import { UserRole, User as UserType } from "@/prisma/client";

export default function AdminManagementPage() {
  // 主要狀態
  const [allAdmins, setAllAdmins] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 狀態訊息 (替代 alert)
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 確認對話框狀態
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
    onCancel: () => void;
    type: "warning" | "danger";
  } | null>(null);

  // 模態框狀態
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // 表單狀態
  const [addForm, setAddForm] = useState({
    email: "",
    role: "ADMIN" as "ADMIN" | "SUPERADMIN",
  });

  const [removeForm, setRemoveForm] = useState({
    email: "",
  });

  // 顯示確認對話框的函數
  const showConfirmDialog = (
    title: string,
    message: string,
    onConfirm: () => void,
    type: "warning" | "danger" = "warning",
    confirmText: string = "確認",
  ) => {
    setConfirmDialog({
      show: true,
      title,
      message,
      confirmText,
      onConfirm: () => {
        setConfirmDialog(null);
        onConfirm();
      },
      onCancel: () => setConfirmDialog(null),
      type,
    });
  };

  // 顯示狀態訊息的函數
  const showStatusMessage = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 5000); // 5秒後自動隱藏
  };

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
        const dataArray = Array.isArray(result.data)
          ? result.data
          : [result.data];
        const adminUsers = dataArray.filter(
          (user: UserType) =>
            user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN,
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

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  // 處理提升為管理員
  const _handlePromoteToAdmin = async (userId: string) => {
    showConfirmDialog(
      "提升為管理員",
      "確定要將此用戶提升為管理員嗎？",
      async () => {
        setActionLoading(userId);
        try {
          const result = await promoteToAdmin(userId);
          if (result.success) {
            await loadAdmins();
            showStatusMessage("success", result.message);
          } else {
            showStatusMessage("error", result.message || "操作失敗");
          }
        } catch (error) {
          console.error("Error promoting to admin:", error);
          showStatusMessage("error", "操作時發生錯誤");
        } finally {
          setActionLoading(null);
        }
      },
      "warning",
    );
  };

  // 處理降級管理員
  const handleDemoteFromAdmin = async (userId: string) => {
    showConfirmDialog(
      "移除管理員權限",
      "確定要將此管理員降級為一般用戶嗎？",
      async () => {
        setActionLoading(userId);
        try {
          const result = await demoteFromAdmin(userId);
          if (result.success) {
            await loadAdmins();
            showStatusMessage("success", result.message);
          } else {
            showStatusMessage("error", result.message || "操作失敗");
          }
        } catch (error) {
          console.error("Error demoting from admin:", error);
          showStatusMessage("error", "操作時發生錯誤");
        } finally {
          setActionLoading(null);
        }
      },
      "danger",
      "移除權限",
    );
  };

  // 處理提升為超級管理員
  const handlePromoteToSuperAdmin = async (userId: string) => {
    showConfirmDialog(
      "提升為超級管理員",
      "確定要將此管理員提升為超級管理員嗎？這將賦予最高權限！",
      async () => {
        setActionLoading(userId);
        try {
          const result = await promoteToSuperAdmin(userId);
          if (result.success) {
            await loadAdmins();
            showStatusMessage("success", result.message);
          } else {
            showStatusMessage("error", result.message || "操作失敗");
          }
        } catch (error) {
          console.error("Error promoting to super admin:", error);
          showStatusMessage("error", "操作時發生錯誤");
        } finally {
          setActionLoading(null);
        }
      },
      "warning",
    );
  };

  // 處理降級超級管理員
  const handleDemoteFromSuperAdmin = async (userId: string) => {
    showConfirmDialog(
      "降級超級管理員",
      "確定要將此超級管理員降級為一般管理員嗎？",
      async () => {
        setActionLoading(userId);
        try {
          const result = await demoteFromSuperAdmin(userId);
          if (result.success) {
            await loadAdmins();
            showStatusMessage("success", result.message);
          } else {
            showStatusMessage("error", result.message || "操作失敗");
          }
        } catch (error) {
          console.error("Error demoting from super admin:", error);
          showStatusMessage("error", "操作時發生錯誤");
        } finally {
          setActionLoading(null);
        }
      },
      "warning",
    );
  };

  // 處理新增管理員
  const handleAddAdmin = async () => {
    setModalLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", addForm.email);
      formData.append("role", addForm.role);

      const result = await addAdminByEmail(formData);

      if (result.success) {
        await loadAdmins();
        showStatusMessage("success", result.message);
        setShowAddModal(false);
        setAddForm({ email: "", role: "ADMIN" });
      } else {
        showStatusMessage("error", result.message);
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      showStatusMessage("error", "新增管理員時發生錯誤");
    } finally {
      setModalLoading(false);
    }
  };

  // 處理移除管理員
  const handleRemoveAdmin = async () => {
    showConfirmDialog(
      "移除管理員權限",
      `確定要移除 ${removeForm.email} 的管理員權限嗎？`,
      async () => {
        setModalLoading(true);
        try {
          const formData = new FormData();
          formData.append("email", removeForm.email);

          const result = await removeAdminByEmail(formData);

          if (result.success) {
            await loadAdmins();
            showStatusMessage("success", result.message);
            setShowRemoveModal(false);
            setRemoveForm({ email: "" });
          } else {
            showStatusMessage("error", result.message);
          }
        } catch (error) {
          console.error("Error removing admin:", error);
          showStatusMessage("error", "移除管理員時發生錯誤");
        } finally {
          setModalLoading(false);
        }
      },
      "danger",
      "移除權限",
    );
  };

  // 計算統計數據
  const superAdmins = allAdmins.filter(
    (u: any) => u.role === UserRole.SUPERADMIN,
  ).length;
  const regularAdmins = allAdmins.filter(
    (u: any) => u.role === UserRole.ADMIN,
  ).length;

  // 輔助函數
  const getStatusText = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "已驗證";
      case "PENDING":
        return "待驗證";
      case "UNVERIFIED":
        return "未驗證";
      default:
        return status;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "超級管理員";
      case "ADMIN":
        return "管理員";
      default:
        return role;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
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
    <div className="w-full mx-auto h-auto p-2 sm:p-4 lg:p-6">
      {/* 確認對話框 */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                {confirmDialog.type === "danger" ? (
                  <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-10 h-10 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                )}
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {confirmDialog.title}
                  </h3>
                </div>
              </div>

              <div className="mt-2">
                <p className="text-sm text-gray-500">{confirmDialog.message}</p>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                  confirmDialog.type === "danger"
                    ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    : "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
                }`}
              >
                {confirmDialog.confirmText}
              </button>
              <button
                type="button"
                onClick={confirmDialog.onCancel}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 狀態訊息 */}
      {statusMessage && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-xs sm:max-w-md p-3 sm:p-4 rounded-lg shadow-lg ${
            statusMessage.type === "success"
              ? "bg-green-100 border-l-4 border-green-500"
              : "bg-red-100 border-l-4 border-red-500"
          } transition-all duration-500 ease-in-out`}
        >
          <div className="flex items-center">
            {statusMessage.type === "success" ? (
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mr-2 sm:mr-3 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 mr-2 sm:mr-3 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            <p
              className={`text-sm ${
                statusMessage.type === "success"
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {statusMessage.text}
            </p>
          </div>
        </div>
      )}

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
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              新增管理員
            </button>
          </div>
        </div>
      </div>

      {/* 操作按鈕區域 */}
      {/* <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          新增管理員
        </button>
      </div> */}

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
              <p className="text-xs sm:text-sm text-gray-500 mt-1">管理權限</p>
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
              <p className="text-xs sm:text-sm text-gray-500 mt-1">最高權限</p>
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
          <div className="grid grid-cols-6 text-sm font-medium text-gray-600">
            <div className="col-span-2 text-left">管理員資訊</div>
            <div className="col-span-1 text-center">級別</div>
            <div className="col-span-1 text-center">驗證狀態</div>
            <div className="col-span-1 text-center">加入日期</div>
            <div className="col-span-1 text-center">操作</div>
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
          {allAdmins.map((admin: any) => (
            <div key={admin.id} className="hover:bg-gray-50 transition-colors">
              {/* 桌面版顯示 */}
              <div className="hidden lg:block px-4 py-3">
                <div className="grid grid-cols-6 text-sm items-center">
                  <div className="col-span-2 flex items-center">
                    <div className="flex items-center">
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
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        admin.role === UserRole.SUPERADMIN
                          ? "bg-red-100 text-red-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {getRoleText(admin.role)}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        admin.status === "VERIFIED"
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
                  {/* 操作按鈕欄 */}
                  <div className="col-span-1 flex justify-center space-x-1">
                    {admin.role === UserRole.ADMIN && (
                      <>
                        {/* 提升為超級管理員 */}
                        <button
                          onClick={() => handlePromoteToSuperAdmin(admin.id)}
                          disabled={actionLoading === admin.id}
                          className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                          title="提升為超級管理員"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        {/* 移除管理員權限 */}
                        <button
                          onClick={() => handleDemoteFromAdmin(admin.id)}
                          disabled={actionLoading === admin.id}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                          title="移除管理員權限"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {admin.role === UserRole.SUPERADMIN && (
                      <>
                        {/* 降級為一般管理員 */}
                        <button
                          onClick={() => handleDemoteFromSuperAdmin(admin.id)}
                          disabled={actionLoading === admin.id}
                          className="p-1.5 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-md transition-colors"
                          title="降級為一般管理員"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        {/* 移除管理員權限 */}
                        <button
                          onClick={() => handleDemoteFromAdmin(admin.id)}
                          disabled={actionLoading === admin.id}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                          title="移除管理員權限"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* 手機版顯示 */}
              <div className="lg:hidden px-3 sm:px-4 py-3">
                <div className="flex items-start space-x-3">
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
                      <div className="flex flex-col items-end space-y-1 ml-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            admin.role === UserRole.SUPERADMIN
                              ? "bg-red-100 text-red-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {getRoleText(admin.role)}
                        </span>
                      </div>
                    </div>

                    {/* 手機版操作按鈕 */}
                    <div className="mt-3 flex space-x-2">
                      {admin.role === UserRole.ADMIN && (
                        <>
                          {/* 提升為超級管理員 */}
                          <button
                            onClick={() => handlePromoteToSuperAdmin(admin.id)}
                            disabled={actionLoading === admin.id}
                            className="flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
                          >
                            <ArrowUp className="h-3 w-3 mr-1" />
                            升級
                          </button>
                          {/* 移除管理員權限 */}
                          <button
                            onClick={() => handleDemoteFromAdmin(admin.id)}
                            disabled={actionLoading === admin.id}
                            className="flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                          >
                            <UserMinus className="h-3 w-3 mr-1" />
                            移除
                          </button>
                        </>
                      )}
                      {admin.role === UserRole.SUPERADMIN && (
                        <>
                          {/* 降級為一般管理員 */}
                          <button
                            onClick={() => handleDemoteFromSuperAdmin(admin.id)}
                            disabled={actionLoading === admin.id}
                            className="flex items-center px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors"
                          >
                            <ArrowDown className="h-3 w-3 mr-1" />
                            降級
                          </button>
                          {/* 移除管理員權限 */}
                          <button
                            onClick={() => handleDemoteFromAdmin(admin.id)}
                            disabled={actionLoading === admin.id}
                            className="flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                          >
                            <UserMinus className="h-3 w-3 mr-1" />
                            移除
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 新增管理員模態框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <UserPlus className="h-5 w-5 mr-2 text-green-600" />
                新增管理員
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* 電子郵件輸入 */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="add-admin-email"
                >
                  電子郵件地址
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    name="add-admin-email"
                    type="email"
                    value={addForm.email}
                    onChange={(e) =>
                      setAddForm({ ...addForm, email: e.target.value })
                    }
                    placeholder="請輸入電子郵件地址"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* 管理員類型選擇 */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="role"
                >
                  管理員類型
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="ADMIN"
                      checked={addForm.role === "ADMIN"}
                      onChange={(e) =>
                        setAddForm({
                          ...addForm,
                          role: e.target.value as "ADMIN" | "SUPERADMIN",
                        })
                      }
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <div className="ml-3 flex items-center">
                      <Shield className="h-4 w-4 text-purple-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        一般管理員
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        基本管理權限
                      </span>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="SUPERADMIN"
                      checked={addForm.role === "SUPERADMIN"}
                      onChange={(e) =>
                        setAddForm({
                          ...addForm,
                          role: e.target.value as "ADMIN" | "SUPERADMIN",
                        })
                      }
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <div className="ml-3 flex items-center">
                      <Crown className="h-4 w-4 text-red-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        超級管理員
                      </span>
                      <span className="ml-2 text-xs text-red-500">
                        最高權限，請謹慎授予
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowAddModal(false)}
                disabled={modalLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddAdmin}
                disabled={modalLoading || !addForm.email.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {modalLoading ? "處理中..." : "新增管理員"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 移除管理員模態框 */}
      {showRemoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <UserMinus className="h-5 w-5 mr-2 text-red-600" />
                移除管理員
              </h3>
              <button
                onClick={() => setShowRemoveModal(false)}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* 電子郵件輸入 */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="email"
                >
                  電子郵件地址
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={removeForm.email}
                    onChange={(e) =>
                      setRemoveForm({ ...removeForm, email: e.target.value })
                    }
                    placeholder="請輸入要移除的管理員電子郵件"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              {/* 警告提示 */}
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800">
                      注意事項
                    </h4>
                    <div className="mt-1 text-sm text-red-700">
                      <ul className="list-disc pl-4 space-y-1">
                        <li>此操作將立即移除該用戶的管理員權限</li>
                        <li>如果是超級管理員，將先降級為一般管理員再移除</li>
                        <li>系統需保留至少一個超級管理員</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowRemoveModal(false)}
                disabled={modalLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleRemoveAdmin}
                disabled={modalLoading || !removeForm.email.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {modalLoading ? "處理中..." : "移除管理員"}
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}
