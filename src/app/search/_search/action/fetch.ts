"use server";

import { prisma } from "@/library/prisma";
import { Job, Company, JobCategory } from "@/prisma/client";

/**
 * 強化版的搜尋結果查詢函數
 * 支持關鍵字、職業類別、地區和遠端工作等多維度篩選
 */
export async function fetchSearchResults(params: {
  query?: string; // 關鍵字搜尋
  category?: string; // 職業類別 ID
  city?: string; // 城市
  district?: string; // 地區
  remote?: boolean; // 遠端工作選項
  salaryMin?: number; // 最低薪資
  salaryMax?: number; // 最高薪資
  experience?: string; // 經驗要求 (entry, mid, senior)
  page?: number; // 頁碼
  limit?: number; // 每頁筆數
}) {
  try {
    // 解構參數，設定默認值
    const {
      query = "",
      category = "",
      city = "",
      district = "",
      remote = false,
      salaryMin,
      salaryMax,
      experience,
      page = 1,
      limit = 20,
    } = params;

    // 跳過的記錄數量 (用於分頁)
    const skip = (page - 1) * limit;

    // 構建工作搜尋條件
    let jobWhere: any = {
      published: true,
    };

    // 關鍵字搜尋 (標題、公司名稱、描述)
    if (query) {
      jobWhere.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        {
          company: {
            name: { contains: query, mode: "insensitive" },
          },
        },
      ];
    }

    // 職業類別篩選
    if (category) {
      jobWhere.categoryId = category;
    }

    // 地區篩選
    if (city) {
      if (district) {
        // 如果同時提供了城市和地區，則精確匹配
        jobWhere.location = {
          startsWith: `${city} ${district}`,
          mode: "insensitive",
        };
      } else {
        // 只提供城市，則匹配以該城市開頭的地點
        jobWhere.location = { startsWith: city, mode: "insensitive" };
      }
    }

    // 遠端工作篩選
    if (remote) {
      jobWhere.remote = true;
    }

    // 薪資範圍篩選
    if (salaryMin || salaryMax) {
      jobWhere.AND = jobWhere.AND || [];

      if (salaryMin) {
        jobWhere.AND.push({ salaryMin: { gte: salaryMin } });
      }

      if (salaryMax) {
        jobWhere.AND.push({ salaryMax: { lte: salaryMax } });
      }
    }

    // 經驗要求篩選
    if (experience) {
      jobWhere.experienceLevel = experience;
    }

    // 獲取符合條件的工作列表
    const jobs = await prisma.job.findMany({
      where: jobWhere,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            address: true,
          },
        },
        category: true,
      },
      orderBy: [
        { createdAt: "desc" }, // 其次按建立時間排序
      ],
      skip,
      take: limit,
    });

    // 獲取工作總數 (用於分頁)
    const totalJobs = await prisma.job.count({
      where: jobWhere,
    });

    // 構建公司搜尋條件
    let companyWhere: any = {
      published: true,
    };

    // 關鍵字搜尋 (公司名稱、描述、標籤)
    if (query) {
      companyWhere.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { hasSome: query.split(/\s+/) } }, // 將搜尋關鍵字拆分為標籤進行匹配
      ];
    }

    // 地區篩選
    if (city) {
      if (district) {
        companyWhere.address = {
          contains: `${city} ${district}`,
          mode: "insensitive",
        };
      } else {
        companyWhere.address = { contains: city, mode: "insensitive" };
      }
    }

    // 職業類別篩選 (通過該公司有該類別的職位來間接篩選)
    if (category) {
      companyWhere.jobs = {
        some: {
          categoryId: category,
          published: true,
        },
      };
    }

    // 獲取符合條件的公司列表
    const companies = await prisma.company.findMany({
      where: companyWhere,
      include: {
        category: true,
        _count: {
          select: {
            jobs: {
              where: {
                published: true,
              },
            },
          },
        },
      },
      orderBy: [
        { createdAt: "desc" }, // 其次按建立時間排序
      ],
      take: 10, // 公司列表限制顯示數量
    });

    // 獲取用於過濾的類別列表
    const categories = await prisma.jobCategory.findMany({
      orderBy: {
        name: "asc",
      },
    });

    // 返回搜尋結果和分頁信息
    return {
      jobs: JSON.parse(JSON.stringify(jobs)),
      companies: JSON.parse(JSON.stringify(companies)),
      categories: JSON.parse(JSON.stringify(categories)),
      pagination: {
        total: totalJobs,
        page,
        limit,
        totalPages: Math.ceil(totalJobs / limit),
      },
      filters: {
        query,
        category,
        city,
        district,
        remote,
        salaryMin,
        salaryMax,
        experience,
      },
    };
  } catch (error) {
    console.error("搜尋失敗:", error);
    return {
      jobs: [],
      companies: [],
      categories: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      },
      filters: {},
    };
  }
}

/**
 * 獲取工作類別列表
 */
export async function getJobCategories() {
  try {
    const categories = await prisma.jobCategory.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("獲取工作類別失敗:", error);
    return [];
  }
}

/**
 * 獲取薪資範圍選項
 * 修改為 async 函數以符合 server action 要求
 */
export async function getSalaryRanges() {
  return [
    { min: 0, max: 30000, label: "30K以下" },
    { min: 30000, max: 40000, label: "30K-40K" },
    { min: 40000, max: 50000, label: "40K-50K" },
    { min: 50000, max: 60000, label: "50K-60K" },
    { min: 60000, max: 80000, label: "60K-80K" },
    { min: 80000, max: 100000, label: "80K-100K" },
    { min: 100000, max: null, label: "100K以上" },
  ];
}

/**
 * 獲取經驗要求選項
 * 修改為 async 函數以符合 server action 要求
 */
export async function getExperienceLevels() {
  return [
    { value: "entry", label: "初階 (0-2年)" },
    { value: "mid", label: "中階 (3-5年)" },
    { value: "senior", label: "資深 (5年以上)" },
    { value: "executive", label: "主管職" },
  ];
}
