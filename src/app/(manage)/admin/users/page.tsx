"use client";

import {
  ChevronDown,
  ChevronUp,
  Mail,
  Shield,
  User,
  UserX,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MdPending } from "react-icons/md";

// Server Actions
import { getUsersData } from "@/app/(manage)/admin/users/_users/action/userAction";

import { AccountStatus, UserRole, User as UserType } from "@/prisma/client";

// 篩選類型
type StatusFilter = "all" | AccountStatus;
type RoleFilter = "all" | Partial<UserRole>;
// type SearchType = "all" | UserType;

export default function UserManagementPage() {
  // 主要狀態
  const [allUsers, setAllUsers] = useState<UserType[]>([]); // 儲存所有使用者資料
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 篩選和搜尋狀態
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 載入使用者數據 - 只在頁面初始化時呼叫一次
  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("statusFilter", "all"); // 固定抓取所有狀態的使用者
      formData.append("roleFilter", "all"); // 固定抓取所有角色的使用者
      formData.append("searchQuery", ""); // 不傳送搜尋關鍵字到後端

      const result = await getUsersData(formData);

      if (result.success && result.data) {
        setAllUsers(result.data);
      } else {
        setError(result.message || "載入使用者數據失敗");
      }
    } catch (error) {
      console.error("Error loading users:", error);
      setError("載入使用者數據時發生錯誤");
    } finally {
      setIsLoading(false);
    }
  }, []); // 移除所有依賴，只在組件初始化時執行一次

  // 載入數據
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // 處理查看詳情
  const handleView = (id: string) => {
    setSelectedId(id === selectedId ? null : id);
  };

  // 即時篩選使用者資料（包含搜尋）
  const filteredUsers = useMemo(() => {
    return allUsers.filter((user: UserType) => {
      // 狀態篩選
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter.toUpperCase();

      // 角色篩選
      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      // 搜尋篩選
      const matchesSearch =
        searchQuery.trim() === ""
          ? true
          : user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.displayName?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesRole && matchesSearch;
    });
  }, [allUsers, statusFilter, roleFilter, searchQuery]);

  // 計算統計數據 - 基於所有使用者資料（不受篩選影響）
  const totalUsers = allUsers.length;
  const verifiedUsers = allUsers.filter((u) => u.status === "VERIFIED").length;
  const pendingUsers = allUsers.filter((u) => u.status === "PENDING").length;
  const unverifiedUsers = allUsers.filter(
    (u) => u.status === "UNVERIFIED",
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
      case "GUEST":
        return "訪客";
      case "ALUMNI":
        return "校友";
      case "COMPANY":
        return "企業";
      case "ADMIN":
        return "管理員";
      case "SUPERADMIN":
        return "超級管理員";
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
          <div className="text-red-500 text-lg mb-4">載入失敗</div>
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
        <h1 className="text-xl sm:text-2xl font-semibold text-blue-600">
          使用者管理
        </h1>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* 總使用者數 */}
        <div className="bg-white shadow-sm rounded-lg border p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                總使用者數
              </p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-blue-600">
                {totalUsers.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-green-600 mt-1">
                已驗證: {verifiedUsers}
              </p>
            </div>
            <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
              <Users className="text-blue-600 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </div>
          </div>
        </div>

        {/* 待審核用戶 */}
        <div className="bg-white shadow-sm rounded-lg border p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                待審核用戶
              </p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-yellow-600">
                {pendingUsers.toLocaleString()}
              </p>
              <Link
                className="text-xs sm:text-sm text-blue-500 mt-1"
                href={"/admin/registration"}
              >
                點擊審核用戶
              </Link>
            </div>
            <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
              <MdPending className="text-yellow-600 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </div>
          </div>
        </div>

        {/* 未驗證用戶 */}
        <div className="bg-white shadow-sm rounded-lg border p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                未驗證用戶
              </p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-red-600">
                {unverifiedUsers.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                已拒絕或未驗證
              </p>
            </div>
            <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
              <UserX className="text-red-600 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* 篩選和搜尋選項 */}
      <div className="mb-4 sm:mb-6 bg-white shadow-sm rounded-lg border p-3 sm:p-4">
        <h2 className="text-base sm:text-lg font-semibold text-blue-600 mb-3">
          篩選與搜尋選項
        </h2>

        {/* 搜尋區塊 */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="輸入關鍵字搜尋..."
                  className="w-full h-10 pl-10 pr-8 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              可搜尋: 使用者名稱、電子郵件、顯示名稱、電話等
            </p>
          </div>
        </div>

        {/* 篩選選項 */}
        <div className="space-y-4">
          {/* 驗證狀態篩選 */}
          <div>
            <p className="text-sm text-gray-600 mb-2">驗證狀態</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  statusFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setStatusFilter(AccountStatus.VERIFIED)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  statusFilter === AccountStatus.VERIFIED
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                已驗證
              </button>
              <button
                onClick={() => setStatusFilter(AccountStatus.PENDING)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  statusFilter === AccountStatus.PENDING
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                待驗證
              </button>
              <button
                onClick={() => setStatusFilter(AccountStatus.UNVERIFIED)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  statusFilter === AccountStatus.UNVERIFIED
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                未驗證
              </button>
            </div>
          </div>

          {/* 角色篩選 */}
          <div>
            <p className="text-sm text-gray-600 mb-2">用戶角色</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setRoleFilter("all")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  roleFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setRoleFilter(UserRole.GUEST)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  roleFilter === UserRole.GUEST
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                訪客
              </button>
              <button
                onClick={() => setRoleFilter(UserRole.ALUMNI)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  roleFilter === UserRole.ALUMNI
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                校友
              </button>
              <button
                onClick={() => setRoleFilter(UserRole.COMPANY)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  roleFilter === UserRole.COMPANY
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                企業
              </button>
              <button
                onClick={() => setRoleFilter(UserRole.ADMIN)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  roleFilter === UserRole.ADMIN
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                管理員
              </button>
              <button
                onClick={() => setRoleFilter(UserRole.SUPERADMIN)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  roleFilter === UserRole.SUPERADMIN
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                超級管理員
              </button>
            </div>
          </div>

          {/* 搜尋結果統計 */}
          <div className="text-sm text-gray-600">
            <p>
              搜尋結果: {filteredUsers.length} 位使用者
              {searchQuery ? ` (關鍵字: "${searchQuery}")` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* 使用者列表 */}
      <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
        {/* 桌面版表頭 */}
        <div className="hidden lg:block p-4 bg-gray-50 border-b">
          <div className="grid grid-cols-5 text-sm font-medium text-gray-600">
            <div className="col-span-2 text-left">使用者資訊</div>
            <div className="col-span-1 text-center">角色</div>
            <div className="col-span-1 text-center">驗證狀態</div>
            <div className="col-span-1 text-center">註冊日期</div>
          </div>
        </div>

        <div className="divide-y">
          {/* 空狀態 */}
          {filteredUsers.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-500">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm">無符合條件的使用者</p>
            </div>
          )}

          {/* 使用者列表項目 */}
          {filteredUsers.map((user) => (
            <div key={user.id} className="hover:bg-gray-50 transition-colors">
              {/* 桌面版顯示 */}
              <div className="hidden lg:block px-4 py-3">
                <div className="grid grid-cols-5 text-sm items-center">
                  <div className="col-span-2 flex items-center">
                    <div className="flex items-center">
                      {/* 頭像 */}
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={`${user.displayName || user.username} 的頭像`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 sm:h-7 sm:w-7 text-gray-400" />
                        </div>
                      )}
                      <div className="ml-3 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {user.displayName || user.username}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "SUPERADMIN"
                          ? "bg-red-100 text-red-800"
                          : user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {getRoleText(user.role)}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "VERIFIED"
                          ? "bg-green-100 text-green-800"
                          : user.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {getStatusText(user.status)}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="text-gray-500">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 手機版顯示 */}
              <div className="lg:hidden px-3 sm:px-4 py-3">
                <div className="flex items-start space-x-3">
                  {/* 頭像 */}
                  {user.avatarUrl ? (
                    <div className="flex-shrink-0">
                      <img
                        src={user.avatarUrl}
                        alt={`${user.displayName || user.username} 的頭像`}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-6 w-6 sm:h-7 sm:w-7 text-gray-400" />
                      </div>
                    </div>
                  )}

                  {/* 內容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                          {user.displayName || user.username}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      {/* 狀態標籤 */}
                      <div className="flex flex-col items-end space-y-1 ml-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === "VERIFIED"
                              ? "bg-green-100 text-green-800"
                              : user.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {getStatusText(user.status)}
                        </span>
                      </div>
                    </div>

                    {/* 其他資訊 */}
                    <div className="flex items-center justify-between mt-3">
                      <button
                        onClick={() => handleView(user.id)}
                        className="inline-flex items-center px-3 py-1 text-xs border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
                      >
                        {selectedId === user.id ? (
                          <>
                            收起 <ChevronUp className="ml-1 h-3 w-3" />
                          </>
                        ) : (
                          <>
                            查看 <ChevronDown className="ml-1 h-3 w-3" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 展開的詳細資訊 */}
              {selectedId === user.id && (
                <div className="p-3 sm:p-4 bg-gray-50 text-sm border-t">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {/* 基本資訊 */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 border-b pb-2">
                        基本資訊
                      </h3>

                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-start">
                          <Mail className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-gray-500 text-xs">電子郵件</p>
                            <p className="text-gray-900 break-all">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <User className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-gray-500 text-xs">使用者名稱</p>
                            <p className="text-gray-900">@{user.username}</p>
                          </div>
                        </div>

                        {user.displayName && (
                          <div className="flex items-start">
                            <User className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-gray-500 text-xs">顯示名稱</p>
                              <p className="text-gray-900">
                                {user.displayName}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start">
                          <Shield className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-gray-500 text-xs">用戶角色</p>
                            <div className="flex items-center">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.role === "SUPERADMIN"
                                    ? "bg-red-100 text-red-800"
                                    : user.role === "ADMIN"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {getRoleText(user.role)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 狀態資訊 */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 border-b pb-2">
                        狀態資訊
                      </h3>

                      {/* 時間戳記 */}
                      <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-gray-500 mb-1">註冊時間</p>
                            <p className="text-gray-900">
                              {formatDateTime(user.createdAt)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">最後更新</p>
                            <p className="text-gray-900">
                              {formatDateTime(user.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 操作按鈕 */}
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 底部間距 */}
      <div className="mt-6" />
    </div>
  );
}
