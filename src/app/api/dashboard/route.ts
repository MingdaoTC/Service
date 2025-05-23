// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDashboardStats } from "@/library/dashboard/dashboardService";

// 輔助函數：獲取日期範圍
function getDateRange(timeRange: string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let startDate: Date;
  let days: number;

  switch (timeRange) {
    case "7d":
      days = 7;
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 6); // 包含今天
      break;
    case "90d":
      days = 90;
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 89); // 包含今天
      break;
    case "30d":
    default:
      days = 30;
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 29); // 包含今天
      break;
  }

  return { startDate, days, endDate: today };
}

// 輔助函數：生成日期數組
function generateDateArray(startDate: Date, days: number) {
  const dates = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
}

// 輔助函數：計算成長率
function calculateGrowthRate(
  currentPeriodCount: number,
  previousPeriodCount: number
): number {
  if (previousPeriodCount === 0) return currentPeriodCount > 0 ? 100 : 0;
  return (
    ((currentPeriodCount - previousPeriodCount) / previousPeriodCount) * 100
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "30d";
    const onlyPublished = searchParams.get("onlyPublished") === "true";
    const { startDate, days, endDate } = getDateRange(timeRange);

    // 獲取上個時期的日期範圍（用於計算成長率）
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(startDate.getDate() - days);
    const previousEndDate = new Date(startDate);
    previousEndDate.setDate(startDate.getDate() - 1);

    // 使用 dashboardService 獲取所有統計數據
    const stats = await getDashboardStats(
      startDate,
      endDate,
      previousStartDate,
      previousEndDate,
      onlyPublished
    );

    // 處理每日統計數據
    const dateArray = generateDateArray(startDate, days);

    // 創建日期對應的計數映射
    const userStatsMap = new Map();
    const companyStatsMap = new Map();
    const jobStatsMap = new Map();

    // 處理 MongoDB 聚合查詢結果
    (stats.dailyUserStats as any[]).forEach((stat) => {
      userStatsMap.set(stat.date, stat.count);
    });

    (stats.dailyCompanyStats as any[]).forEach((stat) => {
      companyStatsMap.set(stat.date, stat.count);
    });

    (stats.dailyJobStats as any[]).forEach((stat) => {
      jobStatsMap.set(stat.date, stat.count);
    });

    // 計算每日新增數量（而非累積）
    const users = dateArray.map((date) => {
      const dailyCount = userStatsMap.get(date) || 0;
      return { date, count: dailyCount };
    });

    const companies = dateArray.map((date) => {
      const dailyCount = companyStatsMap.get(date) || 0;
      return { date, count: dailyCount };
    });

    const jobs = dateArray.map((date) => {
      const dailyCount = jobStatsMap.get(date) || 0;
      return { date, count: dailyCount };
    });

    // 計算累積總數用於圖表顯示
    let cumulativeUsers = stats.totalUsers - stats.currentPeriodUsers;
    let cumulativeCompanies =
      stats.totalCompanies - stats.currentPeriodCompanies;
    let cumulativeJobs = stats.totalJobs - stats.currentPeriodJobs;

    const cumulativeUsersData = dateArray.map((date) => {
      const dailyCount = userStatsMap.get(date) || 0;
      cumulativeUsers += dailyCount;
      return { date, count: cumulativeUsers };
    });

    const cumulativeCompaniesData = dateArray.map((date) => {
      const dailyCount = companyStatsMap.get(date) || 0;
      cumulativeCompanies += dailyCount;
      return { date, count: cumulativeCompanies };
    });

    const cumulativeJobsData = dateArray.map((date) => {
      const dailyCount = jobStatsMap.get(date) || 0;
      cumulativeJobs += dailyCount;
      return { date, count: cumulativeJobs };
    });

    // 計算成長率
    const userGrowthRate = calculateGrowthRate(
      stats.currentPeriodUsers,
      stats.previousPeriodUsers
    );
    const companyGrowthRate = calculateGrowthRate(
      stats.currentPeriodCompanies,
      stats.previousPeriodCompanies
    );
    const jobGrowthRate = calculateGrowthRate(
      stats.currentPeriodJobs,
      stats.previousPeriodJobs
    );

    const dashboardData = {
      users: cumulativeUsersData, // 用於趨勢圖的累積數據
      companies: cumulativeCompaniesData,
      jobs: cumulativeJobsData,
      dailyUsers: users, // 用於柱狀圖的每日新增數據
      dailyCompanies: companies,
      dailyJobs: jobs,
      summary: {
        totalUsers: stats.totalUsers,
        totalCompanies: stats.totalCompanies,
        totalJobs: stats.totalJobs,
        newUsersToday: stats.newUsersToday,
        newCompaniesToday: stats.newCompaniesToday,
        newJobsToday: stats.newJobsToday,
        userGrowthRate,
        companyGrowthRate,
        jobGrowthRate,
      },
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "獲取統計數據時發生錯誤",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
