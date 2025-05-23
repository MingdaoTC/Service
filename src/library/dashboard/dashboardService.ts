// lib/dashboard/dashboardService.ts
import { prisma } from "@/library/prisma";

// 獲取總數統計
export async function getTotalUsers(): Promise<number> {
  return await prisma.user.count();
}

export async function getTotalCompanies(): Promise<number> {
  return await prisma.company.count();
}

export async function getTotalJobs(): Promise<number> {
  return await prisma.job.count();
}

// 獲取今日新增數量
export async function getNewUsersToday(): Promise<number> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  return await prisma.user.count({
    where: {
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });
}

export async function getNewCompaniesToday(): Promise<number> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  return await prisma.company.count({
    where: {
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });
}

export async function getNewJobsToday(): Promise<number> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  return await prisma.job.count({
    where: {
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });
}

// 獲取時期內的數量（用於成長率計算）
export async function getUsersInPeriod(
  startDate: Date,
  endDate: Date
): Promise<number> {
  return await prisma.user.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
}

export async function getCompaniesInPeriod(
  startDate: Date,
  endDate: Date
): Promise<number> {
  return await prisma.company.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
}

export async function getJobsInPeriod(
  startDate: Date,
  endDate: Date
): Promise<number> {
  return await prisma.job.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
}

// 獲取每日統計數據 - 使用 MongoDB 聚合查詢
export async function getDailyUserStats(
  startDate: Date,
  endDate: Date
): Promise<Array<{ date: string; count: number }>> {
  // 使用 MongoDB 聚合管道
  const result = await prisma.user.aggregateRaw({
    pipeline: [
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          date: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ],
  });

  return result as unknown as Array<{ date: string; count: number }>;
}

export async function getDailyCompanyStats(
  startDate: Date,
  endDate: Date
): Promise<Array<{ date: string; count: number }>> {
  const result = await prisma.company.aggregateRaw({
    pipeline: [
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          date: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ],
  });

  return result as unknown as Array<{ date: string; count: number }>;
}

export async function getDailyJobStats(
  startDate: Date,
  endDate: Date
): Promise<Array<{ date: string; count: number }>> {
  const result = await prisma.job.aggregateRaw({
    pipeline: [
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          date: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ],
  });

  return result as unknown as Array<{ date: string; count: number }>;
}

// 複合函數：獲取完整的儀表板數據
export interface DashboardStats {
  totalUsers: number;
  totalCompanies: number;
  totalJobs: number;
  newUsersToday: number;
  newCompaniesToday: number;
  newJobsToday: number;
  currentPeriodUsers: number;
  previousPeriodUsers: number;
  currentPeriodCompanies: number;
  previousPeriodCompanies: number;
  currentPeriodJobs: number;
  previousPeriodJobs: number;
  dailyUserStats: Array<{ date: string; count: number }>;
  dailyCompanyStats: Array<{ date: string; count: number }>;
  dailyJobStats: Array<{ date: string; count: number }>;
}

export async function getDashboardStats(
  startDate: Date,
  endDate: Date,
  previousStartDate: Date,
  previousEndDate: Date
): Promise<DashboardStats> {
  const [
    totalUsers,
    totalCompanies,
    totalJobs,
    newUsersToday,
    newCompaniesToday,
    newJobsToday,
    currentPeriodUsers,
    previousPeriodUsers,
    currentPeriodCompanies,
    previousPeriodCompanies,
    currentPeriodJobs,
    previousPeriodJobs,
    dailyUserStats,
    dailyCompanyStats,
    dailyJobStats,
  ] = await Promise.all([
    getTotalUsers(),
    getTotalCompanies(),
    getTotalJobs(),
    getNewUsersToday(),
    getNewCompaniesToday(),
    getNewJobsToday(),
    getUsersInPeriod(startDate, endDate),
    getUsersInPeriod(previousStartDate, previousEndDate),
    getCompaniesInPeriod(startDate, endDate),
    getCompaniesInPeriod(previousStartDate, previousEndDate),
    getJobsInPeriod(startDate, endDate),
    getJobsInPeriod(previousStartDate, previousEndDate),
    getDailyUserStats(startDate, endDate),
    getDailyCompanyStats(startDate, endDate),
    getDailyJobStats(startDate, endDate),
  ]);

  return {
    totalUsers,
    totalCompanies,
    totalJobs,
    newUsersToday,
    newCompaniesToday,
    newJobsToday,
    currentPeriodUsers,
    previousPeriodUsers,
    currentPeriodCompanies,
    previousPeriodCompanies,
    currentPeriodJobs,
    previousPeriodJobs,
    dailyUserStats,
    dailyCompanyStats,
    dailyJobStats,
  };
}
