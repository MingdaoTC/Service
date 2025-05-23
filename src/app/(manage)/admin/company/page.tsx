"use client";

import {
  Briefcase,
  Building2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Tag,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { FaRegBuilding } from "react-icons/fa";
import { IoPeopleOutline } from "react-icons/io5";

import { Company } from "@/prisma/client";

// 篩選類型
type PublishFilter = "all" | "published" | "unpublished";
type SearchType = "name" | "email" | "unifiedNumber" | "contact" | "all";

export default function CompanyManagementPage() {
  // 主要狀態
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 篩選和搜尋狀態
  const [publishFilter, setPublishFilter] = useState<PublishFilter>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchType, setSearchType] = useState<SearchType>("all");

  // 操作相關狀態
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 對話框狀態
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [publishChanging, setPublishChanging] = useState<{
    company: Company;
    newStatus: boolean;
  } | null>(null);

  // 獲取企業數據
  const fetchCompanies = useCallback(async () => {
    try {
      const response = await fetch("/api/company", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch companies: ${response.status}`);
      }

      const result = await response.json();
      if (result.status !== 200) {
        throw new Error(result.message || "API returned unsuccessful response");
      }

      return result.data;
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw error;
    }
  }, []); // Empty dependency array since fetchCompanies doesn't depend on any props/state

  // 載入企業數據
  useEffect(() => {
    const loadCompanies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchCompanies();
        setCompanies(data);
      } catch (error) {
        console.error("Error loading companies:", error);
        setError(
          error instanceof Error ? error.message : "Unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanies();
  }, [fetchCompanies]); // Now include fetchCompanies in the dependency array

  // 處理查看詳情
  const handleView = (id: string) => {
    setSelectedId(id === selectedId ? null : id);
  };

  // 處理發布狀態變更
  const handlePublishStatusChange = (company: Company, newStatus: boolean) => {
    setPublishChanging({ company, newStatus });
    setShowPublishDialog(true);
  };

  // 提交發布狀態變更
  const submitPublishChange = () => {
    if (!publishChanging) {
      return;
    }

    setProcessingId(publishChanging.company.id);

    startTransition(async () => {
      try {
        const response = await fetch(
          `/api/companies/${publishChanging.company.id}/publish`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              published: publishChanging.newStatus,
            }),
          },
        );

        const result = await response.json();

        if (result.success) {
          // 更新本地狀態
          setCompanies((prevCompanies) =>
            prevCompanies.map((company) =>
              company.id === publishChanging.company.id
                ? { ...company, published: publishChanging.newStatus }
                : company,
            ),
          );

          setStatusMessage({
            type: "success",
            text: `${publishChanging.newStatus ? "發布" : "取消發布"}成功`,
          });

          setShowPublishDialog(false);
        } else {
          setStatusMessage({
            type: "error",
            text: `操作失敗：${result.message || "更新過程中發生錯誤"}`,
          });
        }
      } catch (error) {
        console.error("更新發布狀態時發生錯誤:", error);
        setStatusMessage({
          type: "error",
          text: "系統錯誤：更新過程中發生錯誤",
        });
      } finally {
        setProcessingId(null);
        setTimeout(() => setStatusMessage(null), 3000);
      }
    });
  };

  // 取消發布狀態變更
  const cancelPublishChange = () => {
    setShowPublishDialog(false);
    setPublishChanging(null);
  };

  // 搜尋和篩選邏輯
  const filteredCompanies = companies.filter((company: any) => {
    // 發布狀態篩選
    if (publishFilter === "published" && !company.published) {
      return false;
    }
    if (publishFilter === "unpublished" && company.published) {
      return false;
    }

    // 搜尋篩選
    if (searchQuery.trim() === "") {
      return true;
    }

    const query = searchQuery.toLowerCase().trim();

    if (searchType === "name") {
      return company.name.toLowerCase().includes(query);
    }
    if (searchType === "email") {
      return company.email.toLowerCase().includes(query);
    }
    if (searchType === "unifiedNumber") {
      return company.unifiedNumber.includes(query);
    }
    if (searchType === "contact") {
      return (
        (company.user?.displayName?.toLowerCase().includes(query) ?? false) ||
        (company.user?.username?.toLowerCase().includes(query) ?? false) ||
        company.phone?.includes(query)
      );
    }
    // 全部搜尋
    return (
      company.name.toLowerCase().includes(query) ||
      company.email.toLowerCase().includes(query) ||
      company.unifiedNumber.includes(query) ||
      (company.user?.displayName?.toLowerCase().includes(query) ?? false) ||
      (company.user?.username?.toLowerCase().includes(query) ?? false) ||
      company.phone?.includes(query) ||
      company.tags.some((tag: any) => tag.toLowerCase().includes(query))
    );
  });

  // 計算統計數據
  const totalCompanies = companies.length;
  const publishedCompanies = companies.filter((c) => c.published).length;
  const totalJobs = companies.reduce(
    (sum, c: any) => sum + (c.jobs?.length || 0),
    0,
  );
  const publishedJobs = companies
    .filter((c) => c.published)
    .reduce(
      (sum, c: any) =>
        sum + (c.jobs?.filter((j: any) => j.published).length || 0),
      0,
    );

  // 格式化日期
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="w-full mx-auto h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">載入企業資料中...</p>
        </div>
      </div>
    );
  }

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
      {/* 狀態訊息 */}
      {statusMessage && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-xs sm:max-w-md p-3 sm:p-4 rounded-lg shadow-lg ${statusMessage.type === "success"
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
              className={`text-sm ${statusMessage.type === "success"
                  ? "text-green-700"
                  : "text-red-700"
                }`}
            >
              {statusMessage.text}
            </p>
          </div>
        </div>
      )}

      {/* 發布狀態變更對話框 */}
      {showPublishDialog && publishChanging && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={cancelPublishChange}
            onKeyDown={cancelPublishChange}
          />
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md z-10 overflow-hidden transform transition-all">
            <div className="px-4 sm:px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                確認{publishChanging.newStatus ? "發布" : "取消發布"}企業
              </h3>
            </div>
            <div className="p-4 sm:p-6">
              <p className="text-gray-600 text-sm sm:text-base">
                確定要{publishChanging.newStatus ? "發布" : "取消發布"}「
                <span className="font-medium">
                  {publishChanging.company.name}
                </span>
                」嗎？
              </p>
              {publishChanging.newStatus === false && (
                <p className="text-sm text-red-600 mt-2">
                  ⚠️ 取消發布後，該企業將不會在公開頁面顯示
                </p>
              )}
            </div>
            <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={cancelPublishChange}
                disabled={isPending}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
              >
                取消
              </button>
              <button
                onClick={submitPublishChange}
                disabled={isPending}
                className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium text-white ${isPending
                    ? "bg-gray-400 cursor-not-allowed"
                    : publishChanging.newStatus
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 transition flex items-center justify-center`}
              >
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    處理中...
                  </>
                ) : (
                  `確認${publishChanging.newStatus ? "發布" : "取消發布"}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 頁面標題 */}
      <div className="mb-4 sm:mb-6 bg-white shadow-sm rounded-lg border p-3 sm:p-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-blue-600">
          企業管理
        </h1>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-2 gap-6 mb-6 sm:mb-8">
        <div className="bg-white shadow-sm rounded-lg border p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                總企業數
              </p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-blue-600">
                {totalCompanies.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-green-600 mt-1">
                已發布: {publishedCompanies}
              </p>
            </div>
            <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
              <FaRegBuilding className="text-blue-600 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                總工作數
              </p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-green-600">
                {totalJobs.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-green-600 mt-1">
                已發布: {publishedJobs}
              </p>
            </div>
            <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
              <Briefcase className="text-green-600 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                發布率
              </p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-yellow-600">
                {totalCompanies > 0
                  ? ((publishedCompanies / totalCompanies) * 100).toFixed(1)
                  : 0}
                %
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
                企業發布比例
              </p>
            </div>
            <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
              <IoPeopleOutline className="text-yellow-600 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                平均工作數
              </p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-purple-600">
                {totalCompanies > 0
                  ? (totalJobs / totalCompanies).toFixed(1)
                  : 0}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">每家企業</p>
            </div>
            <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
              <Building2 className="text-purple-600 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
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
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as SearchType)}
                className="h-10 px-3 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto sm:min-w-[120px]"
              >
                <option value="all">全部欄位</option>
                <option value="name">公司名稱</option>
                <option value="email">電子郵件</option>
                <option value="unifiedNumber">統一編號</option>
                <option value="contact">聯絡人</option>
              </select>
            </div>
            <p className="text-xs text-gray-500">
              可搜尋: 公司名稱、電子郵件、統一編號、聯絡人、標籤等
            </p>
          </div>
        </div>

        {/* 篩選選項 */}
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-2">發布狀態</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setPublishFilter("all")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${publishFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                全部
              </button>
              <button
                onClick={() => setPublishFilter("published")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${publishFilter === "published"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                已發布
              </button>
              <button
                onClick={() => setPublishFilter("unpublished")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${publishFilter === "unpublished"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                未發布
              </button>
            </div>
          </div>

          {/* 搜尋結果統計 */}
          <div className="text-sm text-gray-600">
            <p>
              搜尋結果: {filteredCompanies.length} 家企業
              {searchQuery ? ` (關鍵字: "${searchQuery}")` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* 企業列表 */}
      <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
        {/* 桌面版表頭 */}
        <div className="hidden lg:block p-4 bg-gray-50 border-b">
          <div className="grid grid-cols-6 text-sm font-medium text-gray-600">
            <div className="col-span-2 text-left">公司名稱</div>
            <div className="col-span-1 text-center">統一編號</div>
            <div className="col-span-1 text-center">工作數</div>
            <div className="col-span-1 text-center">發布狀態</div>
            <div className="col-span-1 text-center">建立日期</div>
          </div>
        </div>

        <div className="divide-y">
          {filteredCompanies.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-500">
              <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm">無符合條件的企業</p>
            </div>
          )}

          {filteredCompanies.map((company: any) => (
            <div
              key={company.id}
              className="hover:bg-gray-50 transition-colors"
            >
              {/* 桌面版顯示 */}
              <div className="hidden lg:block px-4 py-3">
                <div className="grid grid-cols-6 text-sm items-center">
                  <div className="col-span-2 flex items-center">
                    <div className="flex items-center">
                      {company.logoUrl ? (
                        <div className="w-10 h-10 rounded-md border p-1 flex-shrink-0">
                          <div
                            className="w-full h-full"
                            style={{
                              backgroundImage: `url(${process.env.NEXT_PUBLIC_S3_BUCKET_PUBLIC_URL + company.logoUrl})`,
                              backgroundSize: "contain",
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "center",
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-md border p-1 flex-shrink-0">
                          <Building2 className="h-full w-full text-gray-400" />
                        </div>
                      )}
                      <div className="ml-3 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {company.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {company.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="text-gray-900">
                      {company.unifiedNumber}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {company._count?.jobs || 0} 個
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${company.published
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {company.published ? "已發布" : "未發布"}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="text-gray-500">
                      {formatDate(company.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 手機版顯示 */}
              <div className="lg:hidden px-3 sm:px-4 py-3">
                <div className="flex items-start space-x-3">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    {company.logoUrl ? (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-md border p-1">
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundImage: `url(${process.env.NEXT_PUBLIC_S3_BUCKET_PUBLIC_URL + company.logoUrl})`,
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-md border p-1">
                        <Building2 className="h-full w-full text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* 內容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                          {company.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 truncate mt-1">
                          {company.email}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-600">
                            統編: {company.unifiedNumber}
                          </span>
                        </div>
                      </div>

                      {/* 狀態標籤 */}
                      <div className="flex flex-col items-end space-y-1 ml-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${company.published
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {company.published ? "已發布" : "未發布"}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {company._count?.jobs || 0} 個職缺
                        </span>
                      </div>
                    </div>

                    {/* 建立日期和操作按鈕 */}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">
                        {formatDate(company.createdAt)}
                      </span>
                      <button
                        onClick={() => handleView(company.id)}
                        className="inline-flex items-center px-3 py-1 text-xs border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
                      >
                        {selectedId === company.id ? (
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
              {selectedId === company.id && (
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
                              {company.email}
                            </p>
                          </div>
                        </div>

                        {company.phone && (
                          <div className="flex items-start">
                            <Phone className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-gray-500 text-xs">電話</p>
                              <p className="text-gray-900">{company.phone}</p>
                            </div>
                          </div>
                        )}

                        {company.fax && (
                          <div className="flex items-start">
                            <Phone className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-gray-500 text-xs">傳真</p>
                              <p className="text-gray-900">{company.fax}</p>
                            </div>
                          </div>
                        )}

                        {company.website && (
                          <div className="flex items-start">
                            <Globe className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-gray-500 text-xs">網站</p>
                              <Link
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline flex items-center break-all"
                              >
                                {company.website}
                                <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                              </Link>
                            </div>
                          </div>
                        )}

                        {company.address && (
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-gray-500 text-xs">地址</p>
                              <p className="text-gray-900">{company.address}</p>
                            </div>
                          </div>
                        )}

                        {company.numberOfEmployees && (
                          <div className="flex items-start">
                            <Users className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-gray-500 text-xs">員工人數</p>
                              <p className="text-gray-900">
                                {company.numberOfEmployees.toLocaleString()} 人
                              </p>
                            </div>
                          </div>
                        )}

                        {company.capital && (
                          <div className="flex items-start">
                            <Building2 className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-gray-500 text-xs">資本額</p>
                              <p className="text-gray-900">
                                NT$ {company.capital.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )}

                        {company.category && (
                          <div className="flex items-start">
                            <Tag className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-gray-500 text-xs">產業類別</p>
                              <p className="text-gray-900">
                                {company.category.name}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 詳細資訊 */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 border-b pb-2">
                        詳細資訊
                      </h3>

                      {/* 聯絡人資訊 */}
                      <div>
                        <p className="text-gray-500 text-xs mb-1">帳號負責人</p>
                        <div className="bg-white p-3 rounded border">
                          <p className="font-medium text-gray-900">
                            {company.user.displayName || company.user.username}
                          </p>
                          <p className="text-xs text-gray-500 break-all">
                            @{company.user.username} • {company.user.email}
                          </p>
                          <span
                            className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${company.user.status === "VERIFIED"
                                ? "bg-green-100 text-green-800"
                                : company.user.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                          >
                            {company.user.status === "VERIFIED"
                              ? "已驗證"
                              : company.user.status === "PENDING"
                                ? "待驗證"
                                : "未驗證"}
                          </span>
                        </div>
                      </div>

                      {/* 標籤 */}
                      {company.tags.length > 0 && (
                        <div>
                          <p className="text-gray-500 text-xs mb-2">標籤</p>
                          <div className="flex flex-wrap gap-1">
                            {company.tags.map((tag: any, index: any) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 公司描述 */}
                      {company.description && (
                        <div>
                          <p className="text-gray-500 text-xs mb-1">公司描述</p>
                          <div className="bg-white p-3 rounded border">
                            <p className="text-gray-900 whitespace-pre-wrap">
                              {company.description}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* 工作職缺 */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-gray-500 text-xs">工作職缺</p>
                          <span className="text-xs text-gray-500">
                            共 {company.jobs?.length || 0} 個職缺
                          </span>
                        </div>
                        {company.jobs && company.jobs.length > 0 ? (
                          <div className="bg-white rounded border divide-y max-h-32 overflow-y-auto">
                            {company.jobs.slice(0, 5).map((job: any) => (
                              <div
                                key={job.id}
                                className="p-2 flex items-center justify-between"
                              >
                                <span className="text-sm text-gray-900 truncate flex-1 mr-2">
                                  {job.title}
                                </span>
                                <span
                                  className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${job.published
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                    }`}
                                >
                                  {job.published ? "已發布" : "未發布"}
                                </span>
                              </div>
                            ))}
                            {company.jobs.length > 5 && (
                              <div className="p-2 text-center text-xs text-gray-500">
                                還有 {company.jobs.length - 5} 個職缺...
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="bg-white p-3 rounded border text-center text-gray-500 text-sm">
                            尚無職缺
                          </div>
                        )}
                      </div>

                      {/* 時間戳記 */}
                      <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-gray-500 mb-1">建立時間</p>
                            <p className="text-gray-900">
                              {new Date(company.createdAt).toLocaleString(
                                "zh-TW",
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">最後更新</p>
                            <p className="text-gray-900">
                              {new Date(company.updatedAt).toLocaleString(
                                "zh-TW",
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 操作按鈕 */}
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                      <Link
                        href={`/admin/company/${company.id}/edit`}
                        className="w-full sm:w-auto px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition text-center"
                      >
                        編輯企業
                      </Link>
                      <Link
                        href={`/admin/company/${company.id}/jobs`}
                        className="w-full sm:w-auto px-4 py-2 text-sm border border-green-600 text-green-600 rounded hover:bg-green-50 transition text-center"
                      >
                        管理職缺
                      </Link>
                      <button
                        onClick={() =>
                          handlePublishStatusChange(company, !company.published)
                        }
                        disabled={isPending && processingId === company.id}
                        className={`w-full sm:w-auto px-4 py-2 text-sm rounded transition ${company.published
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-green-600 text-white hover:bg-green-700"
                          } ${isPending && processingId === company.id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                          }`}
                      >
                        {isPending && processingId === company.id ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            處理中...
                          </>
                        ) : company.published ? (
                          "取消發布"
                        ) : (
                          "發布企業"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6" />
    </div>
  );
}
