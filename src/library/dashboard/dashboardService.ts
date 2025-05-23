// lib/dashboard/dashboardService.ts
import { prisma } from "@/library/prisma";

// 獲取總數統計
export async function getTotalUsers(): Promise<number> {
  return await prisma.user.count();
}

export async function getTotalCompanies(
  onlyPublished: boolean = false,
): Promise<number> {
  return await prisma.company.count({
    where: onlyPublished ? { published: true } : undefined,
  });
}

export async function getTotalJobs(
  onlyPublished: boolean = false,
): Promise<number> {
  return await prisma.job.count({
    where: {
      ...(onlyPublished ? { published: true } : {}),
      company: {
        ...(onlyPublished ? { published: true } : {}),
      },
    },
  });
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

export async function getNewCompaniesToday(
  onlyPublished: boolean = false,
): Promise<number> {
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
      ...(onlyPublished ? { published: true } : {}),
    },
  });
}

export async function getNewJobsToday(
  onlyPublished: boolean = false,
): Promise<number> {
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
      ...(onlyPublished ? { published: true } : {}),
      company: {
        ...(onlyPublished ? { published: true } : {}),
      },
    },
  });
}

// 獲取時期內的數量（用於成長率計算）
export async function getUsersInPeriod(
  startDate: Date,
  endDate: Date,
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
  endDate: Date,
  onlyPublished: boolean = false,
): Promise<number> {
  return await prisma.company.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      ...(onlyPublished ? { published: true } : {}),
    },
  });
}

export async function getJobsInPeriod(
  startDate: Date,
  endDate: Date,
  onlyPublished: boolean = false,
): Promise<number> {
  return await prisma.job.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      ...(onlyPublished ? { published: true } : {}),
      company: {
        ...(onlyPublished ? { published: true } : {}),
      },
    },
  });
}

// 簡化版每日統計 - 先使用基本查詢來測試
export async function getDailyUserStats(
  startDate: Date,
  endDate: Date,
): Promise<Array<{ date: string; count: number }>> {
  // 先獲取所有在範圍內的用戶
  const users = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      createdAt: true,
    },
  });

  // 手動按日期分組
  const dateGroups = new Map<string, number>();

  users.map((user) => {
    const dateStr = user.createdAt.toISOString().split("T")[0];
    dateGroups.set(dateStr, (dateGroups.get(dateStr) || 0) + 1);
  });

  // 轉換為需要的格式
  const result = Array.from(dateGroups.entries())
    .map(([date, count]) => ({
      date,
      count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return result;
}

export async function getDailyCompanyStats(
  startDate: Date,
  endDate: Date,
  onlyPublished: boolean = false,
): Promise<Array<{ date: string; count: number }>> {
  const companies = await prisma.company.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      ...(onlyPublished ? { published: true } : {}),
    },
    select: {
      createdAt: true,
    },
  });

  const dateGroups = new Map<string, number>();

  companies.map((company) => {
    const dateStr = company.createdAt.toISOString().split("T")[0];
    dateGroups.set(dateStr, (dateGroups.get(dateStr) || 0) + 1);
  });

  return Array.from(dateGroups.entries())
    .map(([date, count]) => ({
      date,
      count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getDailyJobStats(
  startDate: Date,
  endDate: Date,
  onlyPublished: boolean = false,
): Promise<Array<{ date: string; count: number }>> {
  const jobs = await prisma.job.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      ...(onlyPublished ? { published: true } : {}),
      company: {
        ...(onlyPublished ? { published: true } : {}),
      },
    },
    select: {
      createdAt: true,
    },
  });

  const dateGroups = new Map<string, number>();

  jobs.map((job) => {
    const dateStr = job.createdAt.toISOString().split("T")[0];
    dateGroups.set(dateStr, (dateGroups.get(dateStr) || 0) + 1);
  });

  return Array.from(dateGroups.entries())
    .map(([date, count]) => ({
      date,
      count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
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
  previousEndDate: Date,
  onlyPublished: boolean = false,
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
    getTotalCompanies(onlyPublished),
    getTotalJobs(onlyPublished),
    getNewUsersToday(),
    getNewCompaniesToday(onlyPublished),
    getNewJobsToday(onlyPublished),
    getUsersInPeriod(startDate, endDate),
    getUsersInPeriod(previousStartDate, previousEndDate),
    getCompaniesInPeriod(startDate, endDate, onlyPublished),
    getCompaniesInPeriod(previousStartDate, previousEndDate, onlyPublished),
    getJobsInPeriod(startDate, endDate, onlyPublished),
    getJobsInPeriod(previousStartDate, previousEndDate, onlyPublished),
    getDailyUserStats(startDate, endDate),
    getDailyCompanyStats(startDate, endDate, onlyPublished),
    getDailyJobStats(startDate, endDate, onlyPublished),
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
