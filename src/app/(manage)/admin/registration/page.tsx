"use client";

import Link from "next/link";
// Module
import { useEffect, useState, useTransition } from "react";

// types
import {
  AlumniRegistration,
  CompanyRegistration,
  RegistrationStatus,
} from "@/prisma/client";

// Server Actions
import { approveRegistration } from "@/app/(manage)/admin/registration/_registration/action/approve";
import { rejectRegistration } from "@/app/(manage)/admin/registration/_registration/action/reject";

const CDN_URL = process.env.NEXT_PUBLIC_S3_BUCKET_PUBLIC_URL;

// 註冊類型
type RegistrationType = "all" | "alumni" | "company";
// 圖片顯示方式
type ImageDisplayMode = "image" | "link";

export default function RegistrationApprovalPage() {
  const [companyRegistrations, setCompanyRegistrations] =
    useState<Array<CompanyRegistration>>();
  const [alumniRegistrations, setAlumniRegistrations] =
    useState<Array<AlumniRegistration>>();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 篩選狀態
  const [registrationType, setRegistrationType] =
    useState<RegistrationType>("all");
  const [statusFilter, setStatusFilter] = useState<RegistrationStatus>(
    RegistrationStatus.PENDING,
  );
  // 圖片顯示方式 - 預設為連結模式
  const [imageDisplayMode, setImageDisplayMode] =
    useState<ImageDisplayMode>("link");
  // 搜尋關鍵字
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 搜尋類型
  const [searchType, setSearchType] = useState<"name" | "email" | "both">(
    "both",
  );

  // 新增的審核相關狀態
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingRegistration, setRejectingRegistration] = useState<{
    id: string;
    type: "alumni" | "company";
  } | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 處理查看詳情
  const handleView = (id: string) => {
    setSelectedId(id === selectedId ? null : id);
  };

  // 處理通過申請 - 更新為使用 Server Action
  const handleApprove = (id: string, type: "alumni" | "company") => {
    setProcessingId(id);

    // 建立 FormData
    const formData = new FormData();
    formData.append("id", id);
    formData.append("type", type);

    // 使用 Server Action
    startTransition(async () => {
      try {
        const result = await approveRegistration(formData);

        if (result.success) {
          // 更新本地狀態
          if (type === "company") {
            setCompanyRegistrations((prevRegistrations) =>
              prevRegistrations?.map((reg) =>
                reg.id === id
                  ? {
                      ...reg,
                      status: RegistrationStatus.APPROVED,
                      approvedAt: new Date(),
                    }
                  : reg,
              ),
            );
          } else {
            // 校友註冊沒有 approvedAt 欄位，只更新狀態
            setAlumniRegistrations((prevRegistrations) =>
              prevRegistrations?.map((reg) =>
                reg.id === id
                  ? {
                      ...reg,
                      status: RegistrationStatus.APPROVED,
                      // 不設置 approvedAt
                    }
                  : reg,
              ),
            );
          }

          setStatusMessage({
            type: "success",
            text: `審核成功：${result.message}`,
          });
        } else {
          setStatusMessage({
            type: "error",
            text: `審核失敗：${result.message || "核准過程中發生錯誤"}`,
          });
        }
      } catch (error) {
        console.error("核准過程中發生錯誤:", error);
        setStatusMessage({
          type: "error",
          text: "系統錯誤：核准過程中發生錯誤",
        });
      } finally {
        setProcessingId(null);
        // 3秒後清除狀態訊息
        setTimeout(() => setStatusMessage(null), 3000);
      }
    });
  };

  // 顯示拒絕對話框
  const showRejectDialogHandler = (id: string, type: "alumni" | "company") => {
    setRejectingRegistration({ id, type });
    setRejectReason("");
    setShowRejectDialog(true);
  };

  // 處理拒絕原因變更
  const handleRejectReasonChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setRejectReason(e.target.value);
  };

  // 提交拒絕申請
  const submitReject = () => {
    if (!rejectingRegistration) {
      return;
    }

    setProcessingId(rejectingRegistration.id);

    // 建立 FormData
    const formData = new FormData();
    formData.append("id", rejectingRegistration.id);
    formData.append("type", rejectingRegistration.type);
    formData.append("rejectReason", rejectReason);

    // 使用 Server Action
    startTransition(async () => {
      try {
        const result = await rejectRegistration(formData);

        if (result.success) {
          // 更新本地狀態
          if (rejectingRegistration.type === "company") {
            setCompanyRegistrations((prevRegistrations) =>
              prevRegistrations?.map((reg) =>
                reg.id === rejectingRegistration.id
                  ? {
                      ...reg,
                      status: RegistrationStatus.REJECTED,
                      rejectReason,
                      rejectAt: new Date(),
                    }
                  : reg,
              ),
            );
          } else {
            // 校友註冊沒有 rejectAt 和 rejectReason 欄位，只更新狀態
            setAlumniRegistrations((prevRegistrations) =>
              prevRegistrations?.map((reg) =>
                reg.id === rejectingRegistration.id
                  ? {
                      ...reg,
                      status: RegistrationStatus.REJECTED,
                      // 不設置 rejectAt 和 rejectReason
                    }
                  : reg,
              ),
            );
          }

          setStatusMessage({
            type: "success",
            text: `審核成功：${result.message}`,
          });

          // 關閉對話框
          setShowRejectDialog(false);
        } else {
          setStatusMessage({
            type: "error",
            text: `審核失敗：${result.message || "拒絕過程中發生錯誤"}`,
          });
        }
      } catch (error) {
        console.error("拒絕過程中發生錯誤:", error);
        setStatusMessage({
          type: "error",
          text: "系統錯誤：拒絕過程中發生錯誤",
        });
      } finally {
        setProcessingId(null);
        // 3秒後清除狀態訊息
        setTimeout(() => setStatusMessage(null), 3000);
      }
    });
  };

  // 取消拒絕
  const cancelReject = () => {
    setShowRejectDialog(false);
    setRejectingRegistration(null);
    setRejectReason("");
  };

  // 篩選類型變更
  const handleTypeChange = (type: RegistrationType) => {
    setRegistrationType(type);
  };

  // 篩選狀態變更
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as RegistrationStatus);
  };

  // 搜尋類型變更
  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value as "name" | "email" | "both");
  };

  // 搜尋關鍵字變更
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 清除搜尋
  const clearSearch = () => {
    setSearchQuery("");
  };

  // 圖片顯示方式變更
  const _handleImageDisplayModeChange = (mode: ImageDisplayMode) => {
    setImageDisplayMode(mode);
  };

  // 應用篩選和搜尋的公司註冊
  const filteredCompanyRegistrations = companyRegistrations?.filter((reg) => {
    // 首先應用狀態篩選
    if (reg.status !== statusFilter) {
      return false;
    }

    // 然後應用搜尋條件
    if (searchQuery.trim() === "") {
      return true;
    }

    const query = searchQuery.toLowerCase().trim();

    if (searchType === "name") {
      return (
        reg.name.toLowerCase().includes(query) ||
        reg.companyName.toLowerCase().includes(query)
      );
    }
    if (searchType === "email") {
      return reg.email.toLowerCase().includes(query);
    }
    // 兩者都搜尋
    return (
      reg.name.toLowerCase().includes(query) ||
      reg.email.toLowerCase().includes(query) ||
      reg.companyName.toLowerCase().includes(query) ||
      reg.companyId.toLowerCase().includes(query)
    );
  });

  // 應用篩選和搜尋的校友註冊
  const filteredAlumniRegistrations = alumniRegistrations?.filter((reg) => {
    // 首先應用狀態篩選
    if (reg.status !== statusFilter) {
      return false;
    }

    // 然後應用搜尋條件
    if (searchQuery.trim() === "") {
      return true;
    }

    const query = searchQuery.toLowerCase().trim();

    if (searchType === "name") {
      return reg.name.toLowerCase().includes(query);
    }
    if (searchType === "email") {
      return reg.email.toLowerCase().includes(query);
    }
    // 兩者都搜尋
    return (
      reg.name.toLowerCase().includes(query) ||
      reg.email.toLowerCase().includes(query) ||
      reg.phone?.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    (async () => {
      const data = (
        await fetch("/api/registration", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json())
      ).data;

      setCompanyRegistrations(data.companyRegistration);
      setAlumniRegistrations(data.alumniRegistration);
    })();
  }, []);

  // 渲染圖片或連結
  const _renderImageOrLink = (
    path: string | null | undefined,
    altText: string,
  ): JSX.Element => {
    // 檢查是否有效的圖片路徑
    if (!path || String(path).toLowerCase() === "false") {
      return <span className="text-gray-500">無資料</span>;
    }

    // 製作圖片查看頁面的 URL
    const showImageUrl = `/showImage?path=${encodeURIComponent(path)}&title=${encodeURIComponent(altText)}`;

    if (imageDisplayMode === "image") {
      return (
        <div>
          <div className="relative">
            <Link href={showImageUrl}>
              <img
                src={CDN_URL + path}
                alt={altText}
                className="w-32 h-32 object-cover rounded-md mb-2 border border-gray-200 cursor-pointer hover:opacity-90 transition"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 flex items-center justify-center transition-all opacity-0 hover:opacity-100">
                <span className="bg-black bg-opacity-70 text-white text-xs py-1 px-2 rounded">
                  點擊放大
                </span>
              </div>
            </Link>
          </div>
          <Link
            href={showImageUrl}
            className="text-mingdao-blue hover:underline text-xs block mt-1"
          >
            檢視完整圖片
          </Link>
        </div>
      );
    } else {
      return (
        <Link
          href={showImageUrl}
          className="text-mingdao-blue hover:underline inline-flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          查看{altText}
        </Link>
      );
    }
  };

  return (
    <div className="w-full mx-auto h-full">
      {/* 新增: 狀態訊息 */}
      {statusMessage && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg ${
            statusMessage.type === "success"
              ? "bg-green-100 border-l-4 border-green-500"
              : "bg-red-100 border-l-4 border-red-500"
          } transition-all duration-500 ease-in-out`}
        >
          <div className="flex items-center">
            {statusMessage.type === "success" ? (
              <svg
                className="h-6 w-6 text-green-500 mr-3"
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
                className="h-6 w-6 text-red-500 mr-3"
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
              className={
                statusMessage.type === "success"
                  ? "text-green-700"
                  : "text-red-700"
              }
            >
              {statusMessage.text}
            </p>
          </div>
        </div>
      )}

      {/* 新增: 拒絕對話框 */}
      {showRejectDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={cancelReject}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                cancelReject();
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="取消拒絕"
          />

          {/* 對話框 */}
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10 overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                請輸入拒絕原因
              </h3>
            </div>

            <div className="p-6">
              <textarea
                placeholder="請輸入拒絕此申請的原因..."
                value={rejectReason}
                onChange={handleRejectReasonChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
              <button
                onClick={cancelReject}
                disabled={isPending}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
              >
                取消
              </button>
              <button
                onClick={submitReject}
                disabled={isPending || !rejectReason.trim()}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                  isPending || !rejectReason.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#F44336] hover:bg-[#d32f2f]"
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition flex items-center`}
              >
                {isPending && rejectingRegistration?.id === processingId ? (
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
                  "確認拒絕"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 篩選和搜尋選項 */}
      <div className="mb-6 bg-white shadow-sm rounded-lg border p-4">
        <h2 className="text-lg font-semibold text-mingdao-blue-dark mb-3">
          篩選與搜尋選項
        </h2>

        {/* 搜尋區塊 */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <div className="flex flex-wrap md:flex-nowrap">
                <div className="relative flex-1 w-full md:w-auto">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                    placeholder="輸入關鍵字搜尋..."
                    className="max-md:rounded-md w-full h-10 pl-10 pr-8 border border-gray-300 rounded-l-md text-sm outline-none"
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
                      onClick={clearSearch}
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
                  onChange={handleSearchTypeChange}
                  className="h-10 px-3 border md:border-l-0 border-gray-300 max-md:rounded-md rounded-r-md text-sm outline-none w-full md:w-auto mt-2 md:mt-0 md:min-w-[120px]"
                >
                  <option value="both">全部欄位</option>
                  <option value="name">姓名/公司</option>
                  <option value="email">信箱</option>
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                可搜尋: 姓名、電子郵件、公司名稱、統編、電話等
              </p>
            </div>
          </div>
        </div>

        {/* 篩選選項 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">註冊類型</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleTypeChange("all")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  registrationType === "all"
                    ? "bg-mingdao-blue text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                全部
              </button>
              <button
                onClick={() => handleTypeChange("alumni")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  registrationType === "alumni"
                    ? "bg-mingdao-blue text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                僅校友
              </button>
              <button
                onClick={() => handleTypeChange("company")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  registrationType === "company"
                    ? "bg-mingdao-blue text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                僅企業
              </button>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">審核狀態</p>
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="w-full h-10 px-3 border border-gray-300 rounded text-sm outline-none"
            >
              <option value={RegistrationStatus.PENDING}>未審核</option>
              <option value={RegistrationStatus.APPROVED}>已通過</option>
              <option value={RegistrationStatus.REJECTED}>已拒絕</option>
            </select>
          </div>
          {/* <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">圖片顯示方式</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleImageDisplayModeChange("link")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${imageDisplayMode === "link"
                  ? "bg-mingdao-blue text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                顯示連結
              </button>
              <button
                onClick={() => handleImageDisplayModeChange("image")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${imageDisplayMode === "image"
                  ? "bg-mingdao-blue text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                顯示圖片
              </button>
            </div>
          </div> */}
        </div>

        {/* 搜尋結果統計 */}
        <div className="mt-4 text-sm text-gray-600">
          <p>
            搜尋結果:
            {registrationType === "all" || registrationType === "company"
              ? ` ${filteredCompanyRegistrations?.length || 0} 個企業申請 `
              : ""}
            {registrationType === "all" ? "，" : ""}
            {registrationType === "all" || registrationType === "alumni"
              ? ` ${filteredAlumniRegistrations?.length || 0} 個校友申請`
              : ""}
            {searchQuery ? ` (關鍵字: "${searchQuery}")` : ""}
          </p>
        </div>
      </div>

      {/* 企業註冊 */}
      {(registrationType === "all" || registrationType === "company") && (
        <>
          <div className="mb-4 bg-white shadow-sm rounded-lg border p-2 pl-4">
            <h1 className="text-xl sm:text-2xl font-semibold text-mingdao-blue-dark my-auto">
              註冊申請驗證審核 - 企業註冊
            </h1>
          </div>
          <div className="bg-white shadow-sm rounded-lg border overflow-hidden mb-8">
            <div className="p-4 bg-gray-50 border-b">
              <div className="grid grid-cols-7 text-base font-medium text-gray-600">
                <div className="col-span-3">公司統編</div>
                <div className="col-span-3">公司名稱</div>
                <div className="col-span-1 text-center">操作</div>
              </div>
            </div>

            <div className="divide-y">
              {filteredCompanyRegistrations?.length === 0 && (
                <div className="px-4 py-6 text-center text-gray-500">
                  無符合條件的企業註冊申請
                </div>
              )}
              {filteredCompanyRegistrations?.map(
                (registration: CompanyRegistration, index) => (
                  <div key={index}>
                    <div className="px-4 py-3">
                      <div className="grid grid-cols-7 items-center text-base">
                        <div className="col-span-3 break-words">
                          {registration.companyId}
                        </div>
                        <div className="col-span-3 break-words">
                          {registration.companyName}
                        </div>
                        <div className="col-span-1 flex justify-center gap-1">
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleView(registration.id)}
                              className="px-2 py-1 text-base border border-mingdao-blue text-mingdao-blue rounded hover:bg-blue-50"
                            >
                              查看
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 展開的詳細資訊 */}
                    {selectedId === registration.id && (
                      <div className="p-4 bg-gray-50 text-sm border-t">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <p className="text-gray-500 mb-1">Email:</p>
                            <p className="break-words">{registration.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">公司負責人:</p>
                            <p>{registration.name}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">
                              負責人聯絡電話:
                            </p>
                            <p>{registration.phone}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">申請人備註:</p>
                            <p className="break-words">{registration.notes}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">目前狀態:</p>
                            <p>
                              {registration.status ===
                                RegistrationStatus.PENDING && "未審核"}
                              {registration.status ===
                                RegistrationStatus.APPROVED && "已通過"}
                              {registration.status ===
                                RegistrationStatus.REJECTED && "已拒絕"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap justify-end gap-3">
                          {registration.status ===
                            RegistrationStatus.PENDING && (
                            <>
                              {/* 更新: 通過企業申請按鈕 */}
                              <button
                                onClick={() =>
                                  handleApprove(registration.id, "company")
                                }
                                disabled={
                                  isPending && processingId === registration.id
                                }
                                className={`px-4 py-1.5 ${
                                  isPending && processingId === registration.id
                                    ? "bg-gray-400"
                                    : "bg-[#4CAF50] hover:bg-[#3f9142]"
                                } text-white text-sm font-medium rounded shadow-sm transition flex items-center`}
                              >
                                {isPending &&
                                processingId === registration.id ? (
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
                                  "通過"
                                )}
                              </button>
                              {/* 更新: 拒絕企業申請按鈕 */}
                              <button
                                onClick={() =>
                                  showRejectDialogHandler(
                                    registration.id,
                                    "company",
                                  )
                                }
                                disabled={
                                  isPending && processingId === registration.id
                                }
                                className={`px-4 py-1.5 ${
                                  isPending && processingId === registration.id
                                    ? "bg-gray-400"
                                    : "bg-[#F44336] hover:bg-[#d32f2f]"
                                } text-white text-sm font-medium rounded shadow-sm transition`}
                              >
                                拒絕
                              </button>
                            </>
                          )}
                          {registration.status !==
                            RegistrationStatus.PENDING && (
                            <div className="text-gray-500 text-sm">
                              <span className="italic">已處理完畢</span>
                              {/* 顯示拒絕原因 */}
                              {registration.status ===
                                RegistrationStatus.REJECTED &&
                                registration.rejectReason && (
                                  <div className="mt-1">
                                    <span className="font-medium">
                                      拒絕原因：
                                    </span>
                                    <span>{registration.rejectReason}</span>
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        </>
      )}

      {/* 校友註冊 */}
      {(registrationType === "all" || registrationType === "alumni") && (
        <>
          <div className="mb-4 bg-white shadow-sm rounded-lg border p-2 pl-4 mt-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-mingdao-blue-dark my-auto">
              註冊申請驗證審核 - 校友註冊
            </h1>
          </div>
          <div className="bg-white shadow-sm rounded-lg border overflow-hidden mt-2">
            <div className="p-4 bg-gray-50 border-b">
              <div className="grid grid-cols-7 text-base font-medium text-gray-600">
                <div className="col-span-6">姓名</div>
                <div className="col-span-1 text-center">操作</div>
              </div>
            </div>

            <div className="divide-y">
              {filteredAlumniRegistrations?.length === 0 && (
                <div className="px-4 py-6 text-center text-gray-500">
                  無符合條件的校友註冊申請
                </div>
              )}
              {filteredAlumniRegistrations?.map(
                (registration: AlumniRegistration, index) => (
                  <div key={index} className="">
                    <div className="px-4 py-3">
                      <div className="grid grid-cols-7 items-center text-base">
                        <div className="col-span-6 break-words">
                          {registration.name}
                        </div>
                        <div className="col-span-1 flex justify-center gap-1">
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleView(registration.id)}
                              className="px-2 py-1 text-base border border-mingdao-blue text-mingdao-blue rounded hover:bg-blue-50"
                            >
                              查看
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 展開的詳細資訊 */}
                    {selectedId === registration.id && (
                      <div className="p-4 bg-gray-50 text-sm border-t">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <p className="text-gray-500 mb-1">Email:</p>
                            <p className="break-words">{registration.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">聯絡電話:</p>
                            <p>{registration.phone}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">申請人備註:</p>
                            <p className="break-words">{registration.notes}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">目前狀態:</p>
                            <p>
                              {registration.status ===
                                RegistrationStatus.PENDING && "未審核"}
                              {registration.status ===
                                RegistrationStatus.APPROVED && "已通過"}
                              {registration.status ===
                                RegistrationStatus.REJECTED && "已拒絕"}
                            </p>
                          </div>
                        </div>
                        {/* 
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                          <div>
                            <p className="text-gray-500 mb-1">
                              申請人學生證正面:
                            </p>
                            {renderImageOrLink(
                              registration.studentCardFront,
                              "學生證正面",
                            )}
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">
                              申請人學生證反面:
                            </p>
                            {renderImageOrLink(
                              registration.studentCardBack,
                              "學生證反面",
                            )}
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">
                              申請人身分證正面:
                            </p>
                            {renderImageOrLink(
                              registration.idDocumentFront,
                              "身分證正面",
                            )}
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">
                              申請人身分證反面:
                            </p>
                            {renderImageOrLink(
                              registration.idDocumentBack,
                              "身分證反面",
                            )}
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">申請人護照:</p>
                            {renderImageOrLink(
                              registration.idDocumentPassport,
                              "護照",
                            )}
                          </div>
                        </div> */}

                        <div className="mt-5 flex flex-wrap justify-end gap-3">
                          {registration.status ===
                            RegistrationStatus.PENDING && (
                            <>
                              {/* 更新: 通過校友申請按鈕 */}
                              <button
                                onClick={() =>
                                  handleApprove(registration.id, "alumni")
                                }
                                disabled={
                                  isPending && processingId === registration.id
                                }
                                className={`px-4 py-1.5 ${
                                  isPending && processingId === registration.id
                                    ? "bg-gray-400"
                                    : "bg-[#4CAF50] hover:bg-[#3f9142]"
                                } text-white text-sm font-medium rounded shadow-sm transition flex items-center`}
                              >
                                {isPending &&
                                processingId === registration.id ? (
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
                                  "通過"
                                )}
                              </button>
                              {/* 更新: 拒絕校友申請按鈕 */}
                              <button
                                onClick={() =>
                                  showRejectDialogHandler(
                                    registration.id,
                                    "alumni",
                                  )
                                }
                                disabled={
                                  isPending && processingId === registration.id
                                }
                                className={`px-4 py-1.5 ${
                                  isPending && processingId === registration.id
                                    ? "bg-gray-400"
                                    : "bg-[#F44336] hover:bg-[#d32f2f]"
                                } text-white text-sm font-medium rounded shadow-sm transition`}
                              >
                                拒絕
                              </button>
                            </>
                          )}
                          {registration.status !==
                            RegistrationStatus.PENDING && (
                            <span className="text-gray-500 text-sm italic">
                              已處理完畢
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        </>
      )}
      <br />
    </div>
  );
}
