"use client";

import { useRouter } from "next/navigation";
// Module
import { useEffect, useState, useTransition } from "react";

// types
import {
  Company,
  EmploymentType,
  Job,
  JobCategory,
  Location,
} from "@/prisma/client";

// Server Actions
import {
  getCompanyData,
  getJobCategoryData,
  getJobsDataByCompanyWithUser,
} from "@/app/(manage)/enterprise/_enterprise/action/fetch";
import { handleJobDelete } from "@/app/(manage)/enterprise/_enterprise/action/handleJobDelete";

export default function JobManagementPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [jobs, setJobs] = useState<Array<Job>>([]);
  const [categories, setCategories] = useState<Array<JobCategory>>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [_companyData, setCompanyData] = useState<Company>();
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  // 篩選狀態
  const [statusFilter, setStatusFilter] = useState<boolean | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [employmentTypeFilter, setEmploymentTypeFilter] =
    useState<string>("all");

  // 搜尋關鍵字
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const categories = await getJobCategoryData();
        if (categories) {
          setCategories(categories);
        }

        const companyData = await getCompanyData();
        if (companyData) {
          setCompanyData(companyData);
        }

        const jobsData = await getJobsDataByCompanyWithUser();
        if (jobsData) {
          setJobs(jobsData);
        }
      } catch (error) {
        console.error("獲取職缺資料失敗:", error);
        setStatusMessage({
          type: "error",
          text: "無法載入職缺資料",
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // 處理查看詳情
  const handleView = (id: string) => {
    setSelectedId(id === selectedId ? null : id);
  };

  // 處理新增職缺
  const handleAddJob = () => {
    router.push("/enterprise/jobs/new");
  };

  // 處理編輯職缺
  const handleEditJob = (id: string) => {
    router.push(`/enterprise/jobs/${id}`);
  };

  // 顯示刪除對話框
  const showDeleteConfirmation = (id: string) => {
    setJobToDelete(id);
    setShowDeleteDialog(true);
  };

  // 取消刪除
  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setJobToDelete(null);
  };

  // 確認刪除職缺
  const confirmDelete = () => {
    if (!jobToDelete) {
      return;
    }

    setProcessingId(jobToDelete);

    startTransition(async () => {
      try {
        const result = await handleJobDelete({ id: jobToDelete });

        if (result === "OK") {
          setJobs((prevJobs) =>
            prevJobs.filter((job) => job.id !== jobToDelete),
          );

          setStatusMessage({
            type: "success",
            text: "職缺已成功刪除！",
          });
        } else {
          setStatusMessage({
            type: "error",
            text: `刪除職缺失敗：${result || "發生未知錯誤"}`,
          });
        }
      } catch (error) {
        console.error("刪除職缺時發生錯誤:", error);
        setStatusMessage({
          type: "error",
          text: "系統錯誤：刪除職缺時發生錯誤",
        });
      } finally {
        setShowDeleteDialog(false);
        setJobToDelete(null);
        setProcessingId(null);
        setTimeout(() => setStatusMessage(null), 3000);
      }
    });
  };

  // 處理篩選條件變更
  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = e.target.value;
    setStatusFilter(value === "all" ? "all" : value === "true");
  };

  const handleCategoryFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setCategoryFilter(e.target.value);
  };

  const handleEmploymentTypeFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setEmploymentTypeFilter(e.target.value);
  };

  // 處理搜尋關鍵字變更
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 清除搜尋
  const clearSearch = () => {
    setSearchQuery("");
  };

  // 處理排序方式變更
  const _handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };

  // 格式化薪資範圍顯示
  const formatSalary = (min: number, max: number, negotiable: boolean) => {
    if (negotiable) {
      return "面議";
    }

    const formatNumber = (num: number) => {
      return new Intl.NumberFormat("zh-TW").format(num);
    };

    if (min === 0 && max === 0) {
      return "面議";
    } else if (min === 0) {
      return `最高 ${formatNumber(max)} 元`;
    } else if (max === 0) {
      return `最低 ${formatNumber(min)} 元`;
    } else {
      return `${formatNumber(min)} - ${formatNumber(max)} 元`;
    }
  };

  // 格式化工作類型顯示
  const formatEmploymentType = (type: EmploymentType) => {
    const typeMap = {
      [EmploymentType.FULL_TIME]: "全職",
      [EmploymentType.PART_TIME]: "兼職",
      [EmploymentType.CONTRACT]: "約聘",
      [EmploymentType.INTERNSHIP]: "實習",
    };
    return typeMap[type] || type;
  };

  // 格式化工作地點顯示
  const formatLocation = (location: Location) => {
    const locationMap = {
      [Location.REMOTE]: "遠端",
      [Location.ONSITE]: "現場",
    };
    return locationMap[location] || location;
  };

  // 格式化日期顯示
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
  };

  // 應用篩選和搜尋條件並排序職缺
  const filteredAndSortedJobs = jobs
    .filter((job) => {
      // 狀態篩選
      if (statusFilter !== "all" && job.published !== statusFilter) {
        return false;
      }

      // 類別篩選
      if (categoryFilter !== "all" && job.categoryId !== categoryFilter) {
        return false;
      }

      // 僱用類型篩選
      if (
        employmentTypeFilter !== "all" &&
        job.employmentType !== employmentTypeFilter
      ) {
        return false;
      }

      // 關鍵字搜尋
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        return (
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      // 依照選定的欄位排序
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "title":
          aValue = a.title;
          bValue = b.title;
          break;
        case "salaryMin":
          aValue = a.salaryMin;
          bValue = b.salaryMin;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
      }

      // 依照排序方向
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // 加載畫面
  if (isLoading) {
    return <></>;
  }

  return (
    <>
      <div className="w-full mx-auto h-full">
        {/* 狀態訊息 */}
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

        {/* 刪除確認對話框 */}
        {showDeleteDialog && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* 背景遮罩 */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={cancelDelete}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  cancelDelete();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="取消刪除"
            />

            {/* 對話框 */}
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10 overflow-hidden transform transition-all">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  確認刪除
                </h3>
              </div>

              <div className="p-6">
                <p className="text-gray-700">
                  您確定要刪除這個職缺嗎？此操作無法撤銷。
                </p>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  disabled={isPending}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                >
                  取消
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isPending}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                    isPending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#F44336] hover:bg-[#d32f2f]"
                  } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition flex items-center`}
                >
                  {isPending && jobToDelete === processingId ? (
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
                    "確認刪除"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 頁面標題和新增按鈕 */}
        <div className="mb-6 bg-white shadow-sm rounded-lg border p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-blue-800">
              職缺管理
            </h1>
            <p className="text-gray-600 mt-1">管理您公司的招聘職缺</p>
          </div>
          <button
            onClick={handleAddJob}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            新增職缺
          </button>
        </div>
        {/* 篩選和搜尋選項 */}
        <div className="mb-6 bg-white shadow-sm rounded-lg border p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
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
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  可搜尋: 職缺標題、職缺描述等
                </p>
              </div>
            </div>
          </div>

          {/* 篩選選項 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">發布狀態</p>
              <select
                value={statusFilter === "all" ? "all" : String(statusFilter)}
                onChange={handleStatusFilterChange}
                className="w-full h-10 px-3 border border-gray-300 rounded text-sm outline-none"
              >
                <option value="all">全部狀態</option>
                <option value="true">已發布</option>
                <option value="false">未發布</option>
              </select>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">職缺類別</p>
              <select
                value={categoryFilter}
                onChange={handleCategoryFilterChange}
                className="w-full h-10 px-3 border border-gray-300 rounded text-sm outline-none"
              >
                <option value="all">全部類別</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">僱用類型</p>
              <select
                value={employmentTypeFilter}
                onChange={handleEmploymentTypeFilterChange}
                className="w-full h-10 px-3 border border-gray-300 rounded text-sm outline-none"
              >
                <option value="all">全部類型</option>
                <option value={EmploymentType.FULL_TIME}>全職</option>
                <option value={EmploymentType.PART_TIME}>兼職</option>
                <option value={EmploymentType.CONTRACT}>約聘</option>
                <option value={EmploymentType.INTERNSHIP}>實習</option>
              </select>
            </div>
          </div>

          {/* 搜尋結果統計 */}
          <div className="mt-4 text-sm text-gray-600">
            <p>
              搜尋結果: {filteredAndSortedJobs.length} 個職缺
              {searchQuery ? ` (關鍵字: "${searchQuery}")` : ""}
            </p>
          </div>
        </div>
        {/* 職缺列表 */}
        <div className="bg-white shadow-sm rounded-lg border overflow-hidden mb-8 text-center">
          <div className="p-4 bg-gray-50 border-b text-center">
            <div className="grid grid-cols-10 text-sm font-medium text-gray-600">
              <div className="col-span-2">職缺項目</div>
              <div className="col-span-2">類別</div>
              <div className="col-span-1">狀態</div>
              <div className="col-span-2">更新日期</div>
              <div className="col-span-3">操作</div>
            </div>
          </div>

          <div className="divide-y">
            {filteredAndSortedJobs.length === 0 && (
              <div className="px-4 py-6 text-center text-gray-500">
                無符合條件的職缺
              </div>
            )}
            {filteredAndSortedJobs.map((job, index) => (
              <div key={index}>
                <div className="px-4 py-3">
                  <div className="grid grid-cols-10 items-center text-sm ">
                    <div className="col-span-2 break-words font-medium justify-center">
                      {job.title}
                    </div>
                    <div className="col-span-2 break-words justify-center">
                      {categories.find((c) => c.id === job.categoryId)?.name ||
                        "未分類"}
                    </div>
                    <div className="col-span-1 justify-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          job.published
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {job.published ? "已發布" : "未發布"}
                      </span>
                    </div>
                    <div className="col-span-2 break-words justify-center">
                      {formatDate(job.updatedAt.toString())}
                    </div>
                    <div className="flex gap-1 justify-center col-span-3">
                      <button
                        onClick={() => handleView(job.id)}
                        className="px-2 py-1 text-xs border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                      >
                        查看
                      </button>
                      <button
                        onClick={() => handleEditJob(job.id)}
                        className="px-2 py-1 text-xs border border-gray-600 text-gray-600 rounded hover:bg-gray-50"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => showDeleteConfirmation(job.id)}
                        className="px-2 py-1 text-xs border border-red-600 text-red-600 rounded hover:bg-red-50"
                      >
                        刪除
                      </button>
                    </div>
                  </div>
                </div>
                {/* 展開的詳細資訊 */}
                {selectedId === job.id && (
                  <div className="p-4 bg-gray-50 text-sm border-t">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500 mb-1">職缺類別:</p>
                        <p>
                          {categories.find((c) => c.id === job.categoryId)
                            ?.name || "未分類"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">僱用類型:</p>
                        <p>{formatEmploymentType(job.employmentType)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">工作模式:</p>
                        <p>
                          {job.location
                            ? formatLocation(job.location)
                            : "未指定"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">工作地點:</p>
                        <p>{job.address ? job.address : "未指定"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">薪資範圍:</p>
                        <p>
                          {formatSalary(
                            job.salaryMin,
                            job.salaryMax,
                            job.negotiable,
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">開始日期:</p>
                        <p>{job.startDate || "未指定"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">職缺數量:</p>
                        <p>{job.numberOfPositions || "未指定"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">經驗要求:</p>
                        <p>{job.experience || "無特定要求"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">學歷要求:</p>
                        <p>{job.education || "無特定要求"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">語言要求:</p>
                        <p>{job.language || "無特定要求"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">專業要求:</p>
                        <p>{job.skills || "無特定要求"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">工作時間:</p>
                        <p>{job.workingHours || "未指定"}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-gray-500 mb-1">職缺描述:</p>
                      <div className="bg-white p-3 rounded border border-gray-200 whitespace-pre-line">
                        {job.description}
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-gray-500 mb-1">員工福利:</p>
                      <div className="bg-white p-3 rounded border border-gray-200 whitespace-pre-line">
                        {job.benefits || "未提供福利資訊"}
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-gray-500 mb-1">其他資訊:</p>
                      <div className="bg-white p-3 rounded border border-gray-200 whitespace-pre-line">
                        {job.others || "無其他資訊"}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap justify-end gap-3">
                      <button
                        onClick={() => handleEditJob(job.id)}
                        className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded shadow-sm transition hover:bg-blue-700 flex items-center"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        編輯職缺
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 無職缺時顯示的提示 */}
        {jobs.length === 0 && (
          <div className="bg-white shadow-sm rounded-lg border p-6 text-center mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              尚未有職缺
            </h3>
            <p className="mt-1 text-gray-500">
              點擊「新增職缺」按鈕來建立您的第一個職缺
            </p>
            <div className="mt-6">
              <button
                onClick={handleAddJob}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="-ml-1 mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                新增職缺
              </button>
            </div>
          </div>
        )}
        <div className="h-[0.05rem]" />
      </div>
    </>
  );
}
