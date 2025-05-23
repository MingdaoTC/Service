"use client";

import {
  fetchSearchResults,
  getEducationLevels,
  getEmploymentTypes,
  getExperienceLevels,
  getJobCategories,
  getSalaryRanges,
} from "@/app/search/_search/action/fetch";
import EnhancedSearch from "@/components/Global/Search/EnhancedSearch";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaBuilding,
  FaChevronDown,
  FaChevronUp,
  FaFilter,
  FaMapMarkerAlt,
  FaTimes,
} from "react-icons/fa";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [results, setResults] = useState<any>({
    jobs: [],
    companies: [],
    categories: [],
    pagination: {},
    filters: {},
  });
  const [loading, setLoading] = useState(true);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // 篩選選項狀態
  const [salaryRanges, setSalaryRanges] = useState<any[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<any[]>([]);
  const [educationLevels, setEducationLevels] = useState<any[]>([]);
  const [employmentTypes, setEmploymentTypes] = useState<any[]>([]);

  // 載入輔助數據
  useEffect(() => {
    const loadSupportData = async () => {
      try {
        const [
          salaryData,
          experienceData,
          educationData,
          employmentData,
          categoriesData,
        ] = await Promise.all([
          getSalaryRanges(),
          getExperienceLevels(),
          getEducationLevels(),
          getEmploymentTypes(),
          getJobCategories(),
        ]);

        setSalaryRanges(salaryData);
        setExperienceLevels(experienceData);
        setEducationLevels(educationData);
        setEmploymentTypes(employmentData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("載入支援數據失敗:", error);
      }
    };

    loadSupportData();
  }, []);

  // 載入搜尋結果
  useEffect(() => {
    // 修改 SearchPage 組件中 fetchResults 函數的參數部分

    const fetchResults = async () => {
      setLoading(true);

      const params = {
        query: searchParams.get("q") || "",
        category: searchParams.get("category") || "",
        location: searchParams.get("location") || "",
        employmentType: searchParams.get("employmentType") || "",
        salaryMin: searchParams.get("salaryMin")
          ? Number.parseInt(searchParams.get("salaryMin") || "0")
          : undefined,
        salaryMax: searchParams.get("salaryMax")
          ? Number.parseInt(searchParams.get("salaryMax") || "0")
          : undefined,
        negotiable:
          searchParams.get("negotiable") === "true" ? true : undefined,
        experience: searchParams.get("experience") || "",
        education: searchParams.get("education") || "",
        skills: searchParams.get("skills") || "",
        page: searchParams.get("page")
          ? Number.parseInt(searchParams.get("page") || "1")
          : 1,
        city: searchParams.get("city") || "",
        district: searchParams.get("district") || "", // 新增地區參數
      };

      try {
        const data = await fetchSearchResults(params);
        setResults(data);

        // 計算活躍的篩選器
        const filters = [];
        if (params.query) {
          filters.push("query");
        }
        if (params.category) {
          filters.push("category");
        }
        if (params.location) {
          filters.push("location");
        }
        if (params.employmentType) {
          filters.push("employmentType");
        }
        if (params.salaryMin || params.salaryMax) {
          filters.push("salary");
        }
        if (params.negotiable) {
          filters.push("negotiable");
        }
        if (params.experience) {
          filters.push("experience");
        }
        if (params.education) {
          filters.push("education");
        }
        if (params.skills) {
          filters.push("skills");
        }
        if (params.city) {
          filters.push("city");
        }
        if (params.district) {
          filters.push("district"); // 新增地區篩選器
        }

        setActiveFilters(filters);
      } catch (error) {
        console.error("搜尋結果獲取失敗:", error);
      } finally {
        setLoading(false);
        // 搜尋完成後回到頁面頂部
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    fetchResults();
  }, [searchParams]);

  // 格式化工作類型顯示
  const formatLocation = () => {
    const city = searchParams.get("city");
    const district = searchParams.get("district");

    if (!city) {
      return "所有地區";
    }

    if (district) {
      return `${city} ${district}`;
    }

    return city;
  };
  const _formatEmploymentType = () => {
    const type = searchParams.get("employmentType");
    if (!type) {
      return "所有工作類型";
    }

    const empType = employmentTypes.find((t) => t.value === type);
    return empType ? empType.label : "所有工作類型";
  };

  // 獲取職業類別名稱
  const getCategoryName = () => {
    const categoryId = searchParams.get("category");
    if (!categoryId) {
      return "所有職業類別";
    }

    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "所有職業類別";
  };

  // 格式化薪資範圍顯示
  const formatSalaryRange = () => {
    const min = searchParams.get("salaryMin");
    const max = searchParams.get("salaryMax");

    if (min && max) {
      return `${Number.parseInt(min) / 1000}K - ${Number.parseInt(max) / 1000}K`;
    } else if (min) {
      return `${Number.parseInt(min) / 1000}K 以上`;
    } else if (max) {
      return `${Number.parseInt(max) / 1000}K 以下`;
    }

    return "所有薪資範圍";
  };

  // 格式化經驗要求顯示
  const formatExperience = () => {
    const exp = searchParams.get("experience");
    if (!exp) {
      return "所有經驗";
    }

    const expLevel = experienceLevels.find((e) => e.value === exp);
    return expLevel ? expLevel.label : "所有經驗";
  };

  // 格式化教育程度顯示
  const _formatEducation = () => {
    const edu = searchParams.get("education");
    if (!edu) {
      return "所有學歷";
    }

    const eduLevel = educationLevels.find((e) => e.value === edu);
    return eduLevel ? eduLevel.label : "所有學歷";
  };

  // 建立新的搜尋參數
  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // 更新參數
    Object.entries(updates).map(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // 重設頁碼 (除非特別指定)
    if (!Object.hasOwn(updates, "page")) {
      params.set("page", "1");
    }

    router.push(`/search?${params.toString()}`);
  };

  // 清除所有篩選條件
  const clearAllFilters = () => {
    router.push("/search");
  };

  // 清除特定篩選條件
  const clearFilter = (filter: string) => {
    const updates: Record<string, string | null> = {};

    switch (filter) {
      case "query":
        updates.q = null;
        break;
      case "category":
        updates.category = null;
        break;
      case "location":
        updates.location = null;
        break;
      case "city":
        updates.city = null;
        updates.district = null; // 清除城市時也清除地區
        break;
      case "district":
        updates.district = null;
        break;
      case "employmentType":
        updates.employmentType = null;
        break;
      case "salary":
        updates.salaryMin = null;
        updates.salaryMax = null;
        break;
      case "negotiable":
        updates.negotiable = null;
        break;
      case "experience":
        updates.experience = null;
        break;
      case "education":
        updates.education = null;
        break;
      case "skills":
        updates.skills = null;
        break;
    }

    updateSearchParams(updates);
  };

  // 處理分頁更改
  const handlePageChange = (page: number) => {
    updateSearchParams({ page: page.toString() });
  };

  // 在數據載入前顯示載入狀態
  if (
    !salaryRanges.length ||
    !experienceLevels.length ||
    !educationLevels.length ||
    !employmentTypes.length
  ) {
    return (
      <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-mingdao-blue rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-7rem)]">
      {/* <ScrollProgressIndicator /> */}

      {/* 搜尋區域 */}
      <div
        className={`bg-mingdao-blue relative p-3 md:p-6 flex justify-center items-start ${isSearchExpanded ? "min-h-[12rem]" : "min-h-[8rem]"}`}
      >
        <div className="w-full max-w-3xl mx-auto relative z-10">
          <div className="bg-white rounded-xl shadow-xl p-4 md:p-5">
            <EnhancedSearch
              searchText={searchParams.get("q") || ""}
              category={searchParams.get("category") || ""}
              location={searchParams.get("city") || ""}
              onExpandChange={(expanded) => setIsSearchExpanded(expanded)}
            />
          </div>
        </div>
      </div>

      {/* 主內容區域 */}
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        {/* 搜尋結果摘要 */}
        <div className="bg-white shadow mb-6 p-4 border border-black border-opacity-10 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h1 className="text-xl font-bold text-mingdao-blue-dark mb-2 sm:mb-0">
              搜尋結果{" "}
              <span className="text-gray-500 text-base font-normal">
                ({results.pagination?.total || 0} 個職位)
              </span>
            </h1>

            <div className="flex items-center">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center px-3 py-1.5 mr-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaFilter className="mr-1" />
                <span className="mr-1">篩選</span>
                {activeFilters.length > 0 && (
                  <span className="bg-mingdao-blue text-white rounded-full text-xs px-1.5 py-0.5">
                    {activeFilters.length}
                  </span>
                )}
              </button>

              {activeFilters.length > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  清除全部
                </button>
              )}
            </div>
          </div>
          {/* 篩選標籤 */}
          {activeFilters.length > 0 && (
            <div className="mt-3 pt-3 border-t flex flex-wrap gap-2">
              {activeFilters.includes("query") && (
                <div className="flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-sm">
                  <span>關鍵字: {searchParams.get("q")}</span>
                  <button
                    onClick={() => clearFilter("query")}
                    className="ml-2 text-blue-400 hover:text-blue-600"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              )}

              {activeFilters.includes("category") && (
                <div className="flex items-center bg-green-50 text-green-700 rounded-full px-3 py-1 text-sm">
                  <span>職業類別: {getCategoryName()}</span>
                  <button
                    onClick={() => clearFilter("category")}
                    className="ml-2 text-green-400 hover:text-green-600"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              )}

              {activeFilters.includes("location") && (
                <div className="flex items-center bg-purple-50 text-purple-700 rounded-full px-3 py-1 text-sm">
                  <span>地區: {formatLocation()}</span>
                  <button
                    onClick={() => clearFilter("location")}
                    className="ml-2 text-purple-400 hover:text-purple-600"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              )}

              {activeFilters.includes("city") && (
                <div className="flex items-center bg-purple-50 text-purple-700 rounded-full px-3 py-1 text-sm">
                  <span>地區: {formatLocation()}</span>
                  <button
                    onClick={() => clearFilter("city")}
                    className="ml-2 text-purple-400 hover:text-purple-600"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              )}

              {activeFilters.includes("remote") && (
                <div className="flex items-center bg-indigo-50 text-indigo-700 rounded-full px-3 py-1 text-sm">
                  <span>遠端工作</span>
                  <button
                    onClick={() => clearFilter("remote")}
                    className="ml-2 text-indigo-400 hover:text-indigo-600"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              )}

              {activeFilters.includes("salary") && (
                <div className="flex items-center bg-yellow-50 text-yellow-700 rounded-full px-3 py-1 text-sm">
                  <span>薪資範圍: {formatSalaryRange()}</span>
                  <button
                    onClick={() => clearFilter("salary")}
                    className="ml-2 text-yellow-400 hover:text-yellow-600"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              )}

              {activeFilters.includes("experience") && (
                <div className="flex items-center bg-orange-50 text-orange-700 rounded-full px-3 py-1 text-sm">
                  <span>經驗: {formatExperience()}</span>
                  <button
                    onClick={() => clearFilter("experience")}
                    className="ml-2 text-orange-400 hover:text-orange-600"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 篩選面板 */}
        {isFilterOpen && (
          <div className="bg-white rounded-lg shadow mb-6 p-4 transition-all duration-300 border border-black border-opacity-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 薪資範圍篩選 */}
              {/* 薪資範圍篩選 */}
              <div className="p-2">
                <h3 className="font-medium mb-2">薪資範圍</h3>
                <div className="space-y-2">
                  {salaryRanges.map((range, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={`salary-${index}`}
                        name="salary"
                        className="h-4 w-4 text-mingdao-blue focus:ring-mingdao-blue"
                        checked={
                          (searchParams.get("salaryMin") ===
                            String(range.min) &&
                            (range.max === null
                              ? true
                              : searchParams.get("salaryMax") ===
                                String(range.max))) ||
                          (!searchParams.get("salaryMin") &&
                            !searchParams.get("salaryMax") &&
                            index === 0)
                        }
                        onChange={() => {
                          updateSearchParams({
                            salaryMin: range.min?.toString() || null,
                            salaryMax: range.max?.toString() || null,
                          });
                        }}
                      />
                      <label
                        htmlFor={`salary-${index}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {range.label}
                      </label>
                    </div>
                  ))}
                  <div className="flex items-center mt-3">
                    <input
                      type="checkbox"
                      id="negotiable-option"
                      className="h-4 w-4 text-mingdao-blue focus:ring-mingdao-blue rounded"
                      checked={searchParams.get("negotiable") === "true"}
                      onChange={(e) => {
                        updateSearchParams({
                          negotiable: e.target.checked ? "true" : null,
                        });
                      }}
                    />
                    <label
                      htmlFor="negotiable-option"
                      className="ml-2 text-sm text-gray-700"
                    >
                      僅顯示薪資可議職位
                    </label>
                  </div>
                </div>
              </div>

              {/* 工作類型篩選 */}
              <div className="p-2">
                <h3 className="font-medium mb-2">工作類型</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="emp-all"
                      name="employmentType"
                      className="h-4 w-4 text-mingdao-blue focus:ring-mingdao-blue"
                      checked={!searchParams.get("employmentType")}
                      onChange={() => {
                        updateSearchParams({ employmentType: null });
                      }}
                    />
                    <label
                      htmlFor="emp-all"
                      className="ml-2 text-sm text-gray-700"
                    >
                      所有工作類型
                    </label>
                  </div>

                  {employmentTypes.map((type) => (
                    <div key={type.value} className="flex items-center">
                      <input
                        type="radio"
                        id={`emp-${type.value}`}
                        name="employmentType"
                        className="h-4 w-4 text-mingdao-blue focus:ring-mingdao-blue"
                        checked={
                          searchParams.get("employmentType") === type.value
                        }
                        onChange={() => {
                          updateSearchParams({ employmentType: type.value });
                        }}
                      />
                      <label
                        htmlFor={`emp-${type.value}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 經驗要求篩選 */}
              <div className="p-2">
                <h3 className="font-medium mb-2">經驗要求</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="exp-all"
                      name="experience"
                      className="h-4 w-4 text-mingdao-blue focus:ring-mingdao-blue"
                      checked={!searchParams.get("experience")}
                      onChange={() => {
                        updateSearchParams({ experience: null });
                      }}
                    />
                    <label
                      htmlFor="exp-all"
                      className="ml-2 text-sm text-gray-700"
                    >
                      所有經驗
                    </label>
                  </div>

                  {experienceLevels.map((exp) => (
                    <div key={exp.value} className="flex items-center">
                      <input
                        type="radio"
                        id={`exp-${exp.value}`}
                        name="experience"
                        className="h-4 w-4 text-mingdao-blue focus:ring-mingdao-blue"
                        checked={searchParams.get("experience") === exp.value}
                        onChange={() => {
                          updateSearchParams({ experience: exp.value });
                        }}
                      />
                      <label
                        htmlFor={`exp-${exp.value}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {exp.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 教育要求篩選 */}
              <div className="p-2">
                <h3 className="font-medium mb-2">學歷要求</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="edu-all"
                      name="education"
                      className="h-4 w-4 text-mingdao-blue focus:ring-mingdao-blue"
                      checked={!searchParams.get("education")}
                      onChange={() => {
                        updateSearchParams({ education: null });
                      }}
                    />
                    <label
                      htmlFor="edu-all"
                      className="ml-2 text-sm text-gray-700"
                    >
                      所有學歷
                    </label>
                  </div>

                  {educationLevels.map((edu) => (
                    <div key={edu.value} className="flex items-center">
                      <input
                        type="radio"
                        id={`edu-${edu.value}`}
                        name="education"
                        className="h-4 w-4 text-mingdao-blue focus:ring-mingdao-blue"
                        checked={searchParams.get("education") === edu.value}
                        onChange={() => {
                          updateSearchParams({ education: edu.value });
                        }}
                      />
                      <label
                        htmlFor={`edu-${edu.value}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {edu.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 技能搜尋 */}
              <div className="p-2">
                <h3 className="font-medium mb-2">技能搜尋</h3>
                <div className="flex">
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    value={searchParams.get("skills") || ""}
                    onChange={(e) => {
                      // 這裡使用 debounce 可能會更好
                      updateSearchParams({ skills: e.target.value || null });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                    placeholder="輸入技能關鍵字，如：React, Python"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  多個技能請用逗號分隔
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左側：搜尋結果 */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="h-64 flex items-center justify-center bg-white rounded-lg shadow">
                <div className="animate-spin h-10 w-10 border-b-2 border-mingdao-blue rounded-full" />
              </div>
            ) : (
              <>
                {/* 職位列表 */}
                {results.jobs.length > 0 ? (
                  <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                    <ul className="divide-y divide-gray-200 border border-black border-opacity-10 rounded-lg">
                      {results.jobs.map((job: any) => (
                        <li
                          key={job.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <Link href={`/job/${job.id}`} className="block p-4">
                            <div className="flex items-start">
                              {/* 公司 Logo */}
                              <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden mr-3">
                                {job.company?.logoUrl ? (
                                  <img
                                    src={
                                      process.env
                                        .NEXT_PUBLIC_S3_BUCKET_PUBLIC_URL +
                                      job.company.logoUrl
                                    }
                                    alt={job.company.name}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-mingdao-blue bg-opacity-10 text-mingdao-blue font-bold">
                                    {job.company?.name?.charAt(0) || "?"}
                                  </div>
                                )}
                              </div>

                              {/* 職位信息 */}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                                  <h2 className="text-base sm:text-lg font-medium text-mingdao-blue truncate">
                                    {job.title}
                                  </h2>
                                  <div className="text-sm text-gray-500">
                                    刊登日期:{" "}
                                    {new Date(job.createdAt).toLocaleDateString(
                                      "zh-TW",
                                    )}
                                  </div>
                                </div>

                                <p className="text-sm text-gray-700 mt-1">
                                  <span className="font-medium text-mingdao-blue-dark">
                                    {job.company?.name}
                                  </span>
                                  {job.location && (
                                    <span className="ml-2 inline-flex items-center text-gray-500">
                                      <FaMapMarkerAlt
                                        className="mr-1"
                                        size={12}
                                      />
                                      {job.address}
                                    </span>
                                  )}
                                  {job.location && (
                                    <span className="ml-2 inline-flex items-center text-gray-500">
                                      <FaMapMarkerAlt
                                        className="mr-1"
                                        size={12}
                                      />
                                      {job.location === "REMOTE" && "遠端工作"}
                                      {job.location === "ONSITE" && "現場工作"}
                                    </span>
                                  )}
                                </p>

                                <div className="mt-2 flex flex-wrap gap-2">
                                  {job.category && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                      {job.category.name}
                                    </span>
                                  )}

                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    {job.employmentType === "FULL_TIME" &&
                                      "全職"}
                                    {job.employmentType === "PART_TIME" &&
                                      "兼職"}
                                    {job.employmentType === "CONTRACT" &&
                                      "約聘"}
                                    {job.employmentType === "INTERN" && "實習"}
                                    {job.employmentType === "TEMPORARY" &&
                                      "臨時工"}
                                  </span>

                                  {job.experience && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                      經驗: {job.experience}
                                    </span>
                                  )}

                                  {job.education && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-pink-100 text-pink-800">
                                      學歷: {job.education}
                                    </span>
                                  )}

                                  {job.salaryMin > 0 && job.salaryMax > 0 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                      {Math.floor(job.salaryMin / 1000)}K -{" "}
                                      {Math.floor(job.salaryMax / 1000)}K
                                      {job.negotiable && " (可面議)"}
                                    </span>
                                  )}

                                  {job.salaryMin === 0 &&
                                    job.salaryMax === 0 &&
                                    job.negotiable && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                        薪資面議
                                      </span>
                                    )}
                                </div>

                                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                  {job.description?.substring(0, 150)}...
                                </p>
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {/* 分頁 */}
                    {results.pagination &&
                      results.pagination.totalPages > 1 && (
                        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
                          <div className="flex-1 flex justify-between sm:hidden">
                            <button
                              onClick={() =>
                                handlePageChange(
                                  Math.max(1, results.pagination.page - 1),
                                )
                              }
                              disabled={results.pagination.page <= 1}
                              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                results.pagination.page <= 1
                                  ? "text-gray-400 bg-gray-100"
                                  : "text-gray-700 bg-white hover:bg-gray-50"
                              }`}
                            >
                              上一頁
                            </button>
                            <button
                              onClick={() =>
                                handlePageChange(
                                  Math.min(
                                    results.pagination.totalPages,
                                    results.pagination.page + 1,
                                  ),
                                )
                              }
                              disabled={
                                results.pagination.page >=
                                results.pagination.totalPages
                              }
                              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                results.pagination.page >=
                                results.pagination.totalPages
                                  ? "text-gray-400 bg-gray-100"
                                  : "text-gray-700 bg-white hover:bg-gray-50"
                              }`}
                            >
                              下一頁
                            </button>
                          </div>
                          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm text-gray-700">
                                顯示第{" "}
                                <span className="font-medium">
                                  {(results.pagination.page - 1) *
                                    results.pagination.limit +
                                    1}
                                </span>{" "}
                                至
                                <span className="font-medium">
                                  {Math.min(
                                    results.pagination.page *
                                      results.pagination.limit,
                                    results.pagination.total,
                                  )}
                                </span>{" "}
                                筆， 共{" "}
                                <span className="font-medium">
                                  {results.pagination.total}
                                </span>{" "}
                                筆結果
                              </p>
                            </div>
                            <div>
                              <nav
                                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                aria-label="Pagination"
                              >
                                <button
                                  onClick={() =>
                                    handlePageChange(
                                      Math.max(1, results.pagination.page - 1),
                                    )
                                  }
                                  disabled={results.pagination.page <= 1}
                                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                                    results.pagination.page <= 1
                                      ? "text-gray-400"
                                      : "text-gray-500 hover:bg-gray-50"
                                  }`}
                                >
                                  <span className="sr-only">上一頁</span>
                                  <FaChevronUp className="h-5 w-5 rotate-90" />
                                </button>

                                {/* 頁碼 */}
                                {Array.from({
                                  length: Math.min(
                                    5,
                                    results.pagination.totalPages,
                                  ),
                                }).map((_, i) => {
                                  let pageNum: number;

                                  if (results.pagination.totalPages <= 5) {
                                    // 如果總頁數少於5，直接顯示1到totalPages
                                    pageNum = i + 1;
                                  } else if (results.pagination.page <= 3) {
                                    // 在靠近開始的位置
                                    pageNum = i + 1;
                                  } else if (
                                    results.pagination.page >=
                                    results.pagination.totalPages - 2
                                  ) {
                                    // 在靠近結束的位置
                                    pageNum =
                                      results.pagination.totalPages - 4 + i;
                                  } else {
                                    // 在中間位置
                                    pageNum = results.pagination.page - 2 + i;
                                  }

                                  return (
                                    <button
                                      key={i}
                                      onClick={() => handlePageChange(pageNum)}
                                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                        pageNum === results.pagination.page
                                          ? "z-10 bg-mingdao-blue text-white border-mingdao-blue"
                                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                      }`}
                                    >
                                      {pageNum}
                                    </button>
                                  );
                                })}

                                <button
                                  onClick={() =>
                                    handlePageChange(
                                      Math.min(
                                        results.pagination.totalPages,
                                        results.pagination.page + 1,
                                      ),
                                    )
                                  }
                                  disabled={
                                    results.pagination.page >=
                                    results.pagination.totalPages
                                  }
                                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                    results.pagination.page >=
                                    results.pagination.totalPages
                                      ? "text-gray-400"
                                      : "text-gray-500 hover:bg-gray-50"
                                  }`}
                                >
                                  <span className="sr-only">下一頁</span>
                                  <FaChevronDown className="h-5 w-5 rotate-90" />
                                </button>
                              </nav>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <FaBriefcase className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      沒有找到符合條件的職位
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      請嘗試調整搜尋條件或清除篩選器
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={clearAllFilters}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mingdao-blue hover:bg-mingdao-blue-dark"
                      >
                        清除所有篩選條件
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          {/* 右側邊欄：公司列表和相關內容 */}
          <div className="lg:col-span-1">
            {/* 推薦公司 */}
            {results.companies.length > 0 && (
              <div className="bg-white rounded-lg shadow overflow-hidden mb-6 border border-black border-opacity-10">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-mingdao-blue-dark flex items-center">
                    <FaBuilding className="mr-2" />
                    相關企業
                  </h3>
                </div>
                <ul className="divide-y divide-gray-200">
                  {results.companies.slice(0, 4).map((company: any) => (
                    <li
                      key={company.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <Link
                        href={`/company/${company.id}`}
                        className="block p-3"
                      >
                        <div className="flex items-center">
                          {/* 公司 Logo */}
                          <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden mr-3">
                            {company.logoUrl ? (
                              <img
                                src={
                                  process.env.NEXT_PUBLIC_S3_BUCKET_PUBLIC_URL +
                                  company.logoUrl
                                }
                                alt={company.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-mingdao-blue bg-opacity-10 text-mingdao-blue font-bold">
                                {company.name?.charAt(0) || "?"}
                              </div>
                            )}
                          </div>

                          {/* 公司信息 */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {company.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {company._count?.jobs || 0} 個職缺
                            </p>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {company.tags
                                ?.slice(0, 2)
                                .map((tag: string, index: number) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700"
                                  >
                                    {tag}
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                {results.companies.length > 4 && (
                  <div className="px-4 py-3 bg-gray-50 text-center">
                    <Link
                      href="/companies"
                      className="text-sm text-mingdao-blue hover:text-mingdao-blue-dark font-medium"
                    >
                      查看更多企業
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* 搜尋小貼士 */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="px-4 py-3 border-b border-gray-200 bg-mingdao-blue-light">
                <h3 className="text-lg font-medium text-mingdao-blue-dark">
                  搜尋小提醒
                </h3>
              </div>
              <div className="p-4">
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-green-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="ml-2">
                      使用關鍵字，例如「
                      <span className="text-mingdao-blue">
                        前端、React、遠端
                      </span>
                      」
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-green-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="ml-2">結合職業類別和地區篩選精準搜尋</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-green-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="ml-2">使用薪資範圍篩選找到符合預期的工作</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-green-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="ml-2">定期更新搜尋條件以發現新的職缺機會</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* 訂閱職缺通知 */}
            {/* <div className="bg-mingdao-blue bg-opacity-5 rounded-lg shadow overflow-hidden">
              <div className="p-4">
                <h3 className="text-lg font-medium text-mingdao-blue-dark mb-2">
                  訂閱職缺通知
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  根據您的搜尋條件接收每週最新職缺通知
                </p>
                <form className="space-y-3">
                  <div>
                    <label htmlFor="email" className="sr-only">電子郵件</label>
                    <input
                      type="email"
                      id="email"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-mingdao-blue focus:ring-mingdao-blue sm:text-sm"
                      placeholder="您的電子郵件"
                      required
                    />
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        type="checkbox"
                        className="h-4 w-4 text-mingdao-blue focus:ring-mingdao-blue border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div className="ml-2 text-xs text-gray-500">
                      我同意接收相關職缺通知，並已閱讀<a href="#" className="text-mingdao-blue hover:underline">隱私政策</a>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mingdao-blue hover:bg-mingdao-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mingdao-blue"
                  >
                    訂閱通知
                  </button>
                </form>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
