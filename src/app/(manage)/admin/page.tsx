"use client";

import { Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import { FaRegBuilding } from "react-icons/fa";
import { IoPeopleOutline } from "react-icons/io5";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// 數據類型
interface DashboardData {
  users: Array<{ date: string; count: number }>; // 累積數據用於趨勢圖
  companies: Array<{ date: string; count: number }>;
  jobs: Array<{ date: string; count: number }>;
  dailyUsers: Array<{ date: string; count: number }>; // 每日新增數據用於柱狀圖
  dailyCompanies: Array<{ date: string; count: number }>;
  dailyJobs: Array<{ date: string; count: number }>;
  summary: {
    totalUsers: number;
    totalCompanies: number;
    totalJobs: number;
    newUsersToday: number;
    newCompaniesToday: number;
    newJobsToday: number;
    userGrowthRate: number;
    companyGrowthRate: number;
    jobGrowthRate: number;
  };
}

// 獲取統計數據的 API 函數
const fetchDashboardData = async (
  timeRange: "7d" | "30d" | "90d",
  onlyPublished: boolean,
): Promise<DashboardData> => {
  try {
    const response = await fetch(
      `/api/dashboard?timeRange=${timeRange}&onlyPublished=${onlyPublished}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Response error:", errorText);
      throw new Error(`Failed to fetch dashboard data: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "API returned unsuccessful response");
    }
    return result.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);

    // 如果 API 失敗，返回空數據結構
    return {
      users: [],
      companies: [],
      jobs: [],
      dailyUsers: [],
      dailyCompanies: [],
      dailyJobs: [],
      summary: {
        totalUsers: 0,
        totalCompanies: 0,
        totalJobs: 0,
        newUsersToday: 0,
        newCompaniesToday: 0,
        newJobsToday: 0,
        userGrowthRate: 0,
        companyGrowthRate: 0,
        jobGrowthRate: 0,
      },
    };
  }
};

// 顏色配置
const COLORS = {
  users: "#3B82F6",
  companies: "#10B981",
  jobs: "#F59E0B",
};

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    "7d" | "30d" | "90d"
  >("30d");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onlyPublished, setOnlyPublished] = useState(false); // 新增：是否只查看已發布

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchDashboardData(selectedTimeRange, onlyPublished);
        setDashboardData(data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setError(
          error instanceof Error ? error.message : "Unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedTimeRange, onlyPublished]); // 新增 onlyPublished 依賴

  // 格式化日期顯示
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 準備組合圖表數據（累積趨勢）
  const combinedChartData =
    dashboardData?.users.map((user, index) => ({
      date: formatDate(user.date),
      users: user.count,
      companies: dashboardData.companies[index]?.count || 0,
      jobs: dashboardData.jobs[index]?.count || 0,
    })) || [];

  // 準備每日新增柱狀圖數據
  const dailyChartData =
    dashboardData?.dailyUsers.map((user, index) => ({
      date: formatDate(user.date),
      users: user.count,
      companies: dashboardData.dailyCompanies[index]?.count || 0,
      jobs: dashboardData.dailyJobs[index]?.count || 0,
    })) || [];

  // 準備餅圖數據
  const pieData = dashboardData
    ? [
      {
        name: "使用者",
        value: dashboardData.summary.totalUsers,
        color: COLORS.users,
      },
      {
        name: "公司",
        value: dashboardData.summary.totalCompanies,
        color: COLORS.companies,
      },
      {
        name: "工作",
        value: dashboardData.summary.totalJobs,
        color: COLORS.jobs,
      },
    ]
    : [];

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
    <div className="w-full mx-auto h-full">
      {/* 頁面標題 */}
      <div className="mb-6 bg-white shadow-sm rounded-lg border p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-semibold text-blue-600">
              數據統計 Dashboard
            </h1>

            {/* 時間範圍選擇器 */}
            <div className="flex gap-2">
              {(["7d", "30d", "90d"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition ${selectedTimeRange === range
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {range === "7d" ? "7天" : range === "30d" ? "30天" : "90天"}
                </button>
              ))}
            </div>
          </div>

          {/* 發布狀態篩選器 */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              篩選選項：
            </span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyPublished}
                onChange={(e) => setOnlyPublished(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700">
                只顯示已發布的公司和工作
              </span>
            </label>
            {onlyPublished && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                🔍 已啟用篩選
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* 使用者統計 */}
        <div className="bg-white shadow-sm rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">總使用者數</p>
              <p className="text-3xl font-bold text-blue-600">
                {dashboardData?.summary.totalUsers.toLocaleString() || 0}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{dashboardData?.summary.newUsersToday || 0} 今日新增
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <IoPeopleOutline className="text-blue-600 h-6 w-6" />
            </div>
          </div>
        </div>

        {/* 公司統計 */}
        <div className="bg-white shadow-sm rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">總公司數</p>
              <p className="text-3xl font-bold text-green-600">
                {dashboardData?.summary.totalCompanies.toLocaleString() || 0}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{dashboardData?.summary.newCompaniesToday || 0} 今日新增
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <FaRegBuilding className="text-green-600 h-6 w-6" />
            </div>
          </div>
        </div>

        {/* 工作統計 */}
        <div className="bg-white shadow-sm rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">總工作數</p>
              <p className="text-3xl font-bold text-yellow-600">
                {dashboardData?.summary.totalJobs.toLocaleString() || 0}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{dashboardData?.summary.newJobsToday || 0} 今日新增
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 圖表區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 趨勢圖表 */}
        <div className="bg-white shadow-sm rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-4">
            成長趨勢圖 ({combinedChartData.length} 筆數據)
          </h2>
          {combinedChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={combinedChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={["dataMin - 1", "dataMax + 1"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke={COLORS.users}
                  strokeWidth={2}
                  name="使用者"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="companies"
                  stroke={COLORS.companies}
                  strokeWidth={2}
                  name="公司"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="jobs"
                  stroke={COLORS.jobs}
                  strokeWidth={2}
                  name="工作"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              無趨勢數據
            </div>
          )}
        </div>

        {/* 比例圓餅圖 */}
        <div className="bg-white shadow-sm rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-4">
            數據比例分布 ({pieData.length} 筆數據)
          </h2>
          {pieData.length > 0 && pieData.some((item) => item.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(1)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [value.toLocaleString(), "數量"]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              無比例數據
            </div>
          )}
        </div>
      </div>

      {/* 柱狀圖 - 最近7天每日新增 */}
      <div className="bg-white shadow-sm rounded-lg border p-6 mb-8">
        <h2 className="text-lg font-semibold text-blue-600 mb-4">
          最近7天每日新增統計 ({dailyChartData.slice(-7).length} 筆數據)
        </h2>
        {dailyChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyChartData.slice(-7)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, "dataMax + 1"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <Legend />
              <Bar dataKey="users" fill={COLORS.users} name="使用者" />
              <Bar dataKey="companies" fill={COLORS.companies} name="公司" />
              <Bar dataKey="jobs" fill={COLORS.jobs} name="工作" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            無每日統計數據
          </div>
        )}
      </div>

      {/* 快速統計表格 */}
      <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold text-blue-600">詳細統計數據</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                使用者成長率
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {dashboardData?.summary.userGrowthRate !== undefined
                  ? `${dashboardData.summary.userGrowthRate >= 0 ? "+" : ""}${dashboardData.summary.userGrowthRate.toFixed(1)}%`
                  : "--"}
              </p>
              <p className="text-xs text-gray-500">相較上月</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                公司註冊率
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {dashboardData?.summary.companyGrowthRate !== undefined
                  ? `${dashboardData.summary.companyGrowthRate >= 0 ? "+" : ""}${dashboardData.summary.companyGrowthRate.toFixed(1)}%`
                  : "--"}
              </p>
              <p className="text-xs text-gray-500">相較上月</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                工作發布率
              </h3>
              <p className="text-2xl font-bold text-yellow-600">
                {dashboardData?.summary.jobGrowthRate !== undefined
                  ? `${dashboardData.summary.jobGrowthRate >= 0 ? "+" : ""}${dashboardData.summary.jobGrowthRate.toFixed(1)}%`
                  : "--"}
              </p>
              <p className="text-xs text-gray-500">相較上月</p>
            </div>
          </div>
        </div>
      </div>

      <br />
    </div>
  );
}
