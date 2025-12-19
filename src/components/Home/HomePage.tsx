// components/Home/HomePage.tsx
"use client";

import EnhancedSearch from "@/components/Global/Search/EnhancedSearch";
import CompanyList from "@/components/Home/CompanyList";
import JobList from "@/components/Home/JobList";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

type HomePageProps = {
  jobs: any[];
  companies: any[];
};

export default function HomePage({ jobs, companies }: HomePageProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const trendingSearches = ["前端", "工程師", "UI/UX"];

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Hero 區域 */}
      <section className="relative overflow-hidden">
        <div className="relative w-full max-w-6xl mx-auto px-4 py-16 md:py-20">
          {/* 標題 */}
          <div className="text-center mb-10 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-extrabold text-blue-700 mb-4 leading-tight">
              找到屬於你的
              <span className="text-teal-500"> 理想工作</span>
            </h1>
            <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
              即時職缺、透明薪資、技能標籤與公司評價，幫你做出更好的選擇
            </p>
          </div>

          {/* 搜尋框 */}
          <div
            className={`w-full max-w-3xl mx-auto transition-transform duration-300 ${
              isSearchExpanded ? "-translate-y-2" : ""
            }`}
          >
            <div className="bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 p-4 md:p-6">
              <EnhancedSearch
                onExpandChange={(expanded) => setIsSearchExpanded(expanded)}
              />
              {/* 熱門搜尋 */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 flex items-center">
                  <FaSearch className="mr-1" size={10} />
                  熱門搜尋：
                </span>
                {trendingSearches.map((term, idx) => (
                  <Link
                    key={idx}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Hero 圖片 */}
          <div className="flex">
            <Image
              src="/images/discovery-blue.png"
              alt="Discovery"
              width={500}
              height={50}
              className="mt-12 mx-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* 職缺 & 公司 */}
      <section className="w-full max-w-6xl mx-auto px-4 pb-16">
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden ring-1 ring-slate-200">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
              <h2 className="text-slate-800 font-bold">精選職缺</h2>
            </div>
            <JobList data={jobs} />
          </div>
        </div>

        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden ring-1 ring-slate-200">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
              <h2 className="text-slate-800 font-bold">熱門公司</h2>
            </div>
            <CompanyList data={companies} />
          </div>
        </div>
      </section>
    </div>
  );
}
