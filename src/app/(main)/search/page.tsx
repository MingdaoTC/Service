"use client";

import {
  fetchSearchResults,
  getEducationLevels,
  getEmploymentTypes,
  getExperienceLevels,
  getJobCategories,
  getSalaryRanges,
} from "@/app/(main)/search/_search/action/fetch";
import EnhancedSearch from "@/components/Global/Search/EnhancedSearch";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  FaBriefcase,
  FaBuilding,
  FaChevronDown,
  FaChevronUp,
  FaFilter,
  FaMapMarkerAlt,
  FaTimes,
} from "react-icons/fa";

function SearchPageContent() {
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
        district: searchParams.get("district") || "",
      };

      try {
        const data = await fetchSearchResults(params);
        setResults(data);

        // 計算活躍的篩選器
        const filters: string[] = [];
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
          filters.push("district");
        }

        setActiveFilters(filters);
      } catch (error) {
        console.error("搜尋結果獲取失敗:", error);
      } finally {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    fetchResults();
  }, [searchParams]);

  // 格式化顯示 helpers（不動邏輯）
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

  const getCategoryName = () => {
    const categoryId = searchParams.get("category");
    if (!categoryId) {
      return "所有職業類別";
    }
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "所有職業類別";
  };

  const formatSalaryRange = () => {
    const min = searchParams.get("salaryMin");
    const max = searchParams.get("salaryMax");
    if (min && max) {
      return `${Number.parseInt(min) / 1000}K - ${Number.parseInt(max) / 1000}K`;
    }
    if (min) {
      return `${Number.parseInt(min) / 1000}K 以上`;
    }
    if (max) {
      return `${Number.parseInt(max) / 1000}K 以下`;
    }
    return "所有薪資範圍";
  };

  const formatExperience = () => {
    const exp = searchParams.get("experience");
    if (!exp) {
      return "所有經驗";
    }
    const expLevel = experienceLevels.find((e) => e.value === exp);
    return expLevel ? expLevel.label : "所有經驗";
  };

  // 搜尋參數 helpers（不動邏輯）
  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).map(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    if (!Object.hasOwn(updates, "page")) {
      params.set("page", "1");
    }
    router.push(`/search?${params.toString()}`);
  };

  const clearAllFilters = () => router.push("/search");

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
        updates.district = null;
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

  const handlePageChange = (page: number) =>
    updateSearchParams({ page: page.toString() });

  // 載入支援選項時的 loading
  if (
    !salaryRanges.length ||
    !experienceLevels.length ||
    !educationLevels.length ||
    !employmentTypes.length
  ) {
    return (
      <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-50">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-7rem)] bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* 搜尋區域（亮色漸層） */}
      <div
        className={`relative p-4 md:p-8 flex justify-center items-start bg-gradient-to-r from-blue-50 via-white to-blue-50 ${
          isSearchExpanded ? "min-h-[12rem]" : "min-h-[8rem]"
        }`}
      >
        <div className="w-full max-w-3xl mx-auto relative z-10">
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl ring-1 ring-slate-200 p-4 md:p-5">
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
        <div className="bg-white rounded-2xl shadow-md ring-1 ring-slate-200 mb-6 p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h1 className="text-xl font-bold text-slate-800 mb-2 sm:mb-0">
              搜尋結果{" "}
              <span className="text-slate-500 text-base font-normal">
                ({results.pagination?.total || 0} 個職位)
              </span>
            </h1>

            <div className="flex items-center">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center px-3 py-1.5 mr-2 text-sm rounded-lg bg-white ring-1 ring-slate-200 hover:bg-slate-50 transition-colors"
              >
                <FaFilter className="mr-1" />
                <span className="mr-1">篩選</span>
                {activeFilters.length > 0 && (
                  <span className="bg-blue-600 text-white rounded-full text-xs px-1.5 py-0.5">
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
            <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap gap-2">
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
          <div className="bg-white rounded-2xl shadow-md ring-1 ring-slate-200 mb-6 p-4 transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 薪資範圍篩選 */}
              <div className="p-2">
                <h3 className="font-medium text-slate-800 mb-2">薪資範圍</h3>
                <div className="space-y-2">
                  {salaryRanges.map((range, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={`salary-${index}`}
                        name="salary"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-600"
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
                        className="ml-2 text-sm text-slate-700"
                      >
                        {range.label}
                      </label>
                    </div>
                  ))}
                  <div className="flex items-center mt-3">
                    <input
                      type="checkbox"
                      id="negotiable-option"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-600 rounded"
                      checked={searchParams.get("negotiable") === "true"}
                      onChange={(e) => {
                        updateSearchParams({
                          negotiable: e.target.checked ? "true" : null,
                        });
                      }}
                    />
                    <label
                      htmlFor="negotiable-option"
                      className="ml-2 text-sm text-slate-700"
                    >
                      僅顯示薪資可議職位
                    </label>
                  </div>
                </div>
              </div>

              {/* 工作類型篩選 */}
              <div className="p-2">
                <h3 className="font-medium text-slate-800 mb-2">工作類型</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="emp-all"
                      name="employmentType"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-600"
                      checked={!searchParams.get("employmentType")}
                      onChange={() =>
                        updateSearchParams({ employmentType: null })
                      }
                    />
                    <label
                      htmlFor="emp-all"
                      className="ml-2 text-sm text-slate-700"
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
                        className="h-4 w-4 text-blue-600 focus:ring-blue-600"
                        checked={
                          searchParams.get("employmentType") === type.value
                        }
                        onChange={() =>
                          updateSearchParams({ employmentType: type.value })
                        }
                      />
                      <label
                        htmlFor={`emp-${type.value}`}
                        className="ml-2 text-sm text-slate-700"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 經驗要求篩選 */}
              <div className="p-2">
                <h3 className="font-medium text-slate-800 mb-2">經驗要求</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="exp-all"
                      name="experience"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-600"
                      checked={!searchParams.get("experience")}
                      onChange={() => updateSearchParams({ experience: null })}
                    />
                    <label
                      htmlFor="exp-all"
                      className="ml-2 text-sm text-slate-700"
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
                        className="h-4 w-4 text-blue-600 focus:ring-blue-600"
                        checked={searchParams.get("experience") === exp.value}
                        onChange={() =>
                          updateSearchParams({ experience: exp.value })
                        }
                      />
                      <label
                        htmlFor={`exp-${exp.value}`}
                        className="ml-2 text-sm text-slate-700"
                      >
                        {exp.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 教育要求篩選 */}
              <div className="p-2">
                <h3 className="font-medium text-slate-800 mb-2">學歷要求</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="edu-all"
                      name="education"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-600"
                      checked={!searchParams.get("education")}
                      onChange={() => updateSearchParams({ education: null })}
                    />
                    <label
                      htmlFor="edu-all"
                      className="ml-2 text-sm text-slate-700"
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
                        className="h-4 w-4 text-blue-600 focus:ring-blue-600"
                        checked={searchParams.get("education") === edu.value}
                        onChange={() =>
                          updateSearchParams({ education: edu.value })
                        }
                      />
                      <label
                        htmlFor={`edu-${edu.value}`}
                        className="ml-2 text-sm text-slate-700"
                      >
                        {edu.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 技能搜尋 */}
              <div className="p-2">
                <h3 className="font-medium text-slate-800 mb-2">技能搜尋</h3>
                <div className="flex">
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    value={searchParams.get("skills") || ""}
                    onChange={(e) =>
                      updateSearchParams({ skills: e.target.value || null })
                    }
                    className="flex-1 px-3 py-2 bg-white rounded-md ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="輸入技能關鍵字，如：React, Python"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
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
              <div className="h-64 flex items-center justify-center bg-white rounded-2xl shadow-md ring-1 ring-slate-200">
                <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" />
              </div>
            ) : (
              <>
                {/* 職位列表 */}
                {results.jobs.length > 0 ? (
                  <div className="bg-white rounded-2xl shadow-md ring-1 ring-slate-200 overflow-hidden mb-6">
                    <ul className="divide-y divide-slate-200">
                      {results.jobs.map((job: any) => (
                        <li
                          key={job.id}
                          className="hover:bg-blue-50/40 transition-colors"
                        >
                          <Link href={`/job/${job.id}`} className="block p-4">
                            <div className="flex items-start">
                              {/* 公司 Logo */}
                              <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-slate-100 rounded overflow-hidden mr-3 ring-1 ring-slate-200">
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
                                  <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-700 font-bold">
                                    {job.company?.name?.charAt(0) || "?"}
                                  </div>
                                )}
                              </div>

                              {/* 職位資訊 */}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                                  <h2 className="text-base sm:text-lg font-semibold text-slate-800 truncate">
                                    {job.title}
                                  </h2>
                                  <div className="text-sm text-slate-500">
                                    刊登日期:{" "}
                                    {new Date(job.createdAt).toLocaleDateString(
                                      "zh-TW",
                                    )}
                                  </div>
                                </div>

                                <p className="text-sm text-slate-700 mt-1">
                                  <span className="font-medium text-blue-700">
                                    {job.company?.name}
                                  </span>
                                  {job.location && (
                                    <span className="ml-2 inline-flex items-center text-slate-500">
                                      <FaMapMarkerAlt
                                        className="mr-1"
                                        size={12}
                                      />
                                      {job.address}
                                    </span>
                                  )}
                                  {job.location && (
                                    <span className="ml-2 inline-flex items-center text-slate-500">
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
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                      {job.category.name}
                                    </span>
                                  )}

                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-50 text-teal-700">
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
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700">
                                      經驗: {job.experience}
                                    </span>
                                  )}

                                  {job.education && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-pink-50 text-pink-700">
                                      學歷: {job.education}
                                    </span>
                                  )}

                                  {job.salaryMin > 0 && job.salaryMax > 0 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-50 text-yellow-700">
                                      {Math.floor(job.salaryMin / 1000)}K -{" "}
                                      {Math.floor(job.salaryMax / 1000)}K
                                      {job.negotiable && " (可面議)"}
                                    </span>
                                  )}

                                  {job.salaryMin === 0 &&
                                    job.salaryMax === 0 &&
                                    job.negotiable && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-50 text-yellow-700">
                                        薪資面議
                                      </span>
                                    )}
                                </div>

                                <p className="mt-2 text-sm text-slate-600 line-clamp-2">
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
                        <div className="px-4 py-3 flex items-center justify-between border-t border-slate-200">
                          <div className="flex-1 flex justify-between sm:hidden">
                            <button
                              onClick={() =>
                                handlePageChange(
                                  Math.max(1, results.pagination.page - 1),
                                )
                              }
                              disabled={results.pagination.page <= 1}
                              className={`relative inline-flex items-center px-4 py-2 rounded-md ring-1 ring-slate-200 text-sm font-medium ${
                                results.pagination.page <= 1
                                  ? "text-slate-400 bg-slate-100"
                                  : "text-slate-700 bg-white hover:bg-slate-50"
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
                              className={`ml-3 relative inline-flex items-center px-4 py-2 rounded-md ring-1 ring-slate-200 text-sm font-medium ${
                                results.pagination.page >=
                                results.pagination.totalPages
                                  ? "text-slate-400 bg-slate-100"
                                  : "text-slate-700 bg-white hover:bg-slate-50"
                              }`}
                            >
                              下一頁
                            </button>
                          </div>

                          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm text-slate-700">
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
                                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md ring-1 ring-slate-200 bg-white text-sm font-medium ${
                                    results.pagination.page <= 1
                                      ? "text-slate-400"
                                      : "text-slate-500 hover:bg-slate-50"
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
                                    pageNum = i + 1;
                                  } else if (results.pagination.page <= 3) {
                                    pageNum = i + 1;
                                  } else if (
                                    results.pagination.page >=
                                    results.pagination.totalPages - 2
                                  ) {
                                    pageNum =
                                      results.pagination.totalPages - 4 + i;
                                  } else {
                                    pageNum = results.pagination.page - 2 + i;
                                  }

                                  return (
                                    <button
                                      key={i}
                                      onClick={() => handlePageChange(pageNum)}
                                      className={`relative inline-flex items-center px-4 py-2 ring-1 text-sm font-medium ${
                                        pageNum === results.pagination.page
                                          ? "z-10 bg-blue-600 text-white ring-blue-600"
                                          : "bg-white ring-slate-200 text-slate-500 hover:bg-slate-50"
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
                                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md ring-1 ring-slate-200 bg-white text-sm font-medium ${
                                    results.pagination.page >=
                                    results.pagination.totalPages
                                      ? "text-slate-400"
                                      : "text-slate-500 hover:bg-slate-50"
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
                  <div className="bg-white rounded-2xl shadow-md ring-1 ring-slate-200 p-8 text-center">
                    <FaBriefcase className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-2 text-lg font-medium text-slate-900">
                      沒有找到符合條件的職位
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      請嘗試調整搜尋條件或清除篩選器
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={clearAllFilters}
                        className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:rounded-none shadow-sm transition-all"
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
              <div className="bg-white rounded-2xl shadow-md ring-1 ring-slate-200 overflow-hidden mb-6">
                <div className="px-4 py-3 border-b border-slate-200">
                  <h3 className="text-lg font-medium text-slate-800 flex items-center">
                    <FaBuilding className="mr-2 text-blue-600" />
                    相關企業
                  </h3>
                </div>
                <ul className="divide-y divide-slate-200">
                  {results.companies.slice(0, 4).map((company: any) => (
                    <li
                      key={company.id}
                      className="hover:bg-blue-50/40 transition-colors"
                    >
                      <Link
                        href={`/company/${company.id}`}
                        className="block p-3"
                      >
                        <div className="flex items-center">
                          {/* 公司 Logo */}
                          <div className="w-10 h-10 flex-shrink-0 bg-slate-100 rounded overflow-hidden mr-3 ring-1 ring-slate-200">
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
                              <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-700 font-bold">
                                {company.name?.charAt(0) || "?"}
                              </div>
                            )}
                          </div>

                          {/* 公司資訊 */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-slate-900 truncate">
                              {company.name}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">
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
                  <div className="px-4 py-3 bg-slate-50 text-center">
                    <Link
                      href="/companies"
                      className="text-sm text-blue-700 hover:text-blue-800 font-medium"
                    >
                      查看更多企業
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* 搜尋小提醒 */}
            <div className="bg-white rounded-2xl shadow-md ring-1 ring-slate-200 overflow-hidden mb-6">
              <div className="px-4 py-3 border-b border-slate-200 bg-blue-50">
                <h3 className="text-lg font-medium text-slate-800">
                  搜尋小提醒
                </h3>
              </div>
              <div className="p-4">
                <ul className="space-y-3 text-sm text-slate-600">
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
                      <span className="text-blue-700">前端、React、遠端</span>」
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

            {/* 訂閱職缺通知（保留註解） */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
            <p className="mt-4 text-slate-600">載入中...</p>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
