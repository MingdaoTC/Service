"use server";

import { prisma } from "@/library/prisma";

/**
 * 強化版的搜尋結果查詢函數
 * 支持關鍵字、職業類別、地區和工作類型等多維度篩選
 */
// 在 fetch.ts 中修改 fetchSearchResults 函數

export async function fetchSearchResults(params: {
  query?: string;
  category?: string;
  location?: string;
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
  negotiable?: boolean;
  experience?: string;
  education?: string;
  skills?: string;
  remote?: boolean;
  page?: number;
  limit?: number;
  city?: string;
  district?: string; // 新增 district 參數
}) {
  try {
    // 解構參數，設定默認值
    const {
      query = "",
      category = "",
      location = "",
      employmentType = "",
      salaryMin,
      salaryMax,
      negotiable,
      experience = "",
      education = "",
      skills = "",
      remote = false,
      page = 1,
      limit = 20,
      city = "",
      district = "", // 新增 district 參數的默認值
    } = params;

    // 跳過的記錄數量 (用於分頁)
    const skip = (page - 1) * limit;

    // 構建工作搜尋條件
    const jobWhere: any = {
      published: true,
      company: {
        published: true,
      },
    };

    // 關鍵字搜尋 (標題、描述)
    if (query) {
      jobWhere.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { skills: { contains: query, mode: "insensitive" } },
        {
          company: {
            name: { contains: query, mode: "insensitive" },
          },
        },
        {
          category: {
            name: { contains: query, mode: "insensitive" },
          },
        },
        // {
        //   tags: { hasSome: [query] }, // 使用標籤進行匹配
        // },
      ];
    }

    // 職業類別篩選
    if (category) {
      jobWhere.categoryId = category;
    }

    // 地區篩選 (當不是篩選遠端工作時)
    if (location && !remote) {
      jobWhere.address = { contains: location, mode: "insensitive" };
    }

    // 城市和地區篩選
    if (city || district) {
      jobWhere.AND = jobWhere.AND || [];

      // 如果有指定城市
      if (city) {
        jobWhere.AND.push({ address: { contains: city, mode: "insensitive" } });
      }

      // 如果有指定地區
      if (district) {
        jobWhere.AND.push({
          address: { contains: district, mode: "insensitive" },
        });
      }
    }

    // 工作類型篩選
    if (employmentType) {
      jobWhere.employmentType = employmentType;
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

    // 薪資可議篩選
    if (negotiable !== undefined) {
      jobWhere.negotiable = negotiable;
    }

    // 經驗要求篩選
    if (experience) {
      jobWhere.experience = { contains: experience, mode: "insensitive" };
    }

    // 教育要求篩選
    if (education) {
      jobWhere.education = { contains: education, mode: "insensitive" };
    }

    // 技能要求篩選
    if (skills) {
      jobWhere.skills = { contains: skills, mode: "insensitive" };
    }

    // 遠端工作篩選 - 修正為使用 location 枚舉類型
    if (remote) {
      jobWhere.location = "REMOTE";
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
        { createdAt: "desc" }, // 按建立時間排序
      ],
      skip,
      take: limit,
    });

    // 獲取工作總數 (用於分頁)
    const totalJobs = await prisma.job.count({
      where: jobWhere,
    });

    // 構建公司搜尋條件
    const companyWhere: any = {
      published: true,
    };

    // 關鍵字搜尋 (公司名稱、描述、標籤)
    if (query) {
      companyWhere.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        // { tags: { hasSome: [query] } }, // 使用標籤進行匹配
      ];
    }

    // 地區篩選 (當不是篩選遠端工作時)
    if (location && !remote) {
      companyWhere.address = { contains: location, mode: "insensitive" };
    }

    // 城市和地區篩選
    if (city || district) {
      companyWhere.AND = companyWhere.AND || [];

      // 如果有指定城市
      if (city) {
        companyWhere.AND.push({
          address: { contains: city, mode: "insensitive" },
        });
      }

      // 如果有指定地區
      if (district) {
        companyWhere.AND.push({
          address: { contains: district, mode: "insensitive" },
        });
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

    // 遠端工作篩選對公司的影響 - 修正為使用 location 枚舉類型
    if (remote) {
      companyWhere.jobs = companyWhere.jobs || {
        some: { published: true },
      };
      companyWhere.jobs.some.location = "REMOTE";
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
        { createdAt: "desc" }, // 按建立時間排序
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
        location,
        employmentType,
        salaryMin,
        salaryMax,
        negotiable,
        experience,
        education,
        skills,
        remote,
        city,
        district, // 加入到過濾條件
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
 * 獲取工作類型選項
 */
export async function getEmploymentTypes() {
  return [
    { value: "FULL_TIME", label: "全職" },
    { value: "PART_TIME", label: "兼職" },
    { value: "CONTRACT", label: "約聘" },
    { value: "INTERN", label: "實習" },
    { value: "TEMPORARY", label: "臨時工" },
  ];
}

/**
 * 獲取經驗要求選項
 */
export async function getExperienceLevels() {
  return [
    { value: "不拘", label: "不拘" },
    { value: "1年以下", label: "1年以下" },
    { value: "1-3年", label: "1-3年" },
    { value: "3-5年", label: "3-5年" },
    { value: "5-10年", label: "5-10年" },
    { value: "10年以上", label: "10年以上" },
  ];
}

/**
 * 獲取教育程度選項
 */
export async function getEducationLevels() {
  return [
    { value: "不拘", label: "不拘" },
    { value: "高中職", label: "高中職" },
    { value: "專科", label: "專科" },
    { value: "大學", label: "大學" },
    { value: "碩士", label: "碩士" },
    { value: "博士", label: "博士" },
  ];
}
