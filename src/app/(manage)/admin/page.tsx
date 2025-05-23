"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// 數據類型
interface DashboardData {
  users: Array<{ date: string; count: number; }>;
  companies: Array<{ date: string; count: number; }>;
  jobs: Array<{ date: string; count: number; }>;
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
const fetchDashboardData = async (timeRange: '7d' | '30d' | '90d'): Promise<DashboardData> => {
  try {
    const response = await fetch(`/api/dashboard?timeRange=${timeRange}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);

    // 如果 API 失敗，返回空數據結構
    return {
      users: [],
      companies: [],
      jobs: [],
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
      }
    };
  }
};

// 顏色配置
const COLORS = {
  users: '#3B82F6',
  companies: '#10B981',
  jobs: '#F59E0B'
};

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDashboardData(selectedTimeRange);
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // 可以在這裡設置錯誤狀態或顯示錯誤訊息
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedTimeRange]);

  // 格式化日期顯示
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 準備組合圖表數據
  const combinedChartData = dashboardData?.users.map((user, index) => ({
    date: formatDate(user.date),
    users: user.count,
    companies: dashboardData.companies[index]?.count || 0,
    jobs: dashboardData.jobs[index]?.count || 0,
  })) || [];

  // 準備餅圖數據
  const pieData = dashboardData ? [
    { name: '使用者', value: dashboardData.summary.totalUsers, color: COLORS.users },
    { name: '公司', value: dashboardData.summary.totalCompanies, color: COLORS.companies },
    { name: '工作', value: dashboardData.summary.totalJobs, color: COLORS.jobs },
  ] : [];

  if (isLoading) {
    return (
      <div className="w-full mx-auto h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-mingdao-blue mx-auto mb-4"></div>
          <p className="text-gray-600">載入統計資料中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto h-full">
      {/* 頁面標題 */}
      <div className="mb-6 bg-white shadow-sm rounded-lg border p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-semibold text-mingdao-blue-dark">
            數據統計 Dashboard
          </h1>

          {/* 時間範圍選擇器 */}
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${selectedTimeRange === range
                    ? "bg-mingdao-blue text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {range === '7d' ? '7天' : range === '30d' ? '30天' : '90天'}
              </button>
            ))}
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
              <p className="text-3xl font-bold text-mingdao-blue">
                {dashboardData?.summary.totalUsers.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{dashboardData?.summary.newUsersToday} 今日新增
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 公司統計 */}
        <div className="bg-white shadow-sm rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">總公司數</p>
              <p className="text-3xl font-bold text-green-600">
                {dashboardData?.summary.totalCompanies.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{dashboardData?.summary.newCompaniesToday} 今日新增
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        {/* 工作統計 */}
        <div className="bg-white shadow-sm rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">總工作數</p>
              <p className="text-3xl font-bold text-yellow-600">
                {dashboardData?.summary.totalJobs.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{dashboardData?.summary.newJobsToday} 今日新增
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H10a2 2 0 00-2-2V6m8 0h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 圖表區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 趨勢圖表 */}
        <div className="bg-white shadow-sm rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-mingdao-blue-dark mb-4">
            成長趨勢圖
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={combinedChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
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
        </div>

        {/* 比例圓餅圖 */}
        <div className="bg-white shadow-sm rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-mingdao-blue-dark mb-4">
            數據比例分布
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [value.toLocaleString(), '數量']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 柱狀圖 - 最近7天每日新增 */}
      <div className="bg-white shadow-sm rounded-lg border p-6 mb-8">
        <h2 className="text-lg font-semibold text-mingdao-blue-dark mb-4">
          最近7天每日新增統計
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={combinedChartData.slice(-7)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <Legend />
            <Bar dataKey="users" fill={COLORS.users} name="使用者" />
            <Bar dataKey="companies" fill={COLORS.companies} name="公司" />
            <Bar dataKey="jobs" fill={COLORS.jobs} name="工作" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 快速統計表格 */}
      <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold text-mingdao-blue-dark">
            詳細統計數據
          </h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-2">使用者成長率</h3>
              <p className="text-2xl font-bold text-blue-600">
                {dashboardData?.summary.userGrowthRate !== undefined
                  ? `${dashboardData.summary.userGrowthRate >= 0 ? '+' : ''}${dashboardData.summary.userGrowthRate.toFixed(1)}%`
                  : '--'}
              </p>
              <p className="text-xs text-gray-500">相較上月</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-2">公司註冊率</h3>
              <p className="text-2xl font-bold text-green-600">
                {dashboardData?.summary.companyGrowthRate !== undefined
                  ? `${dashboardData.summary.companyGrowthRate >= 0 ? '+' : ''}${dashboardData.summary.companyGrowthRate.toFixed(1)}%`
                  : '--'}
              </p>
              <p className="text-xs text-gray-500">相較上月</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-2">工作發布率</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {dashboardData?.summary.jobGrowthRate !== undefined
                  ? `${dashboardData.summary.jobGrowthRate >= 0 ? '+' : ''}${dashboardData.summary.jobGrowthRate.toFixed(1)}%`
                  : '--'}
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