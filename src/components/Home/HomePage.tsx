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

  // // 熱門職業類別
  // const popularCategories = [
  //   { id: "software", name: "軟體工程師", icon: <FaLightbulb />, color: "blue" },
  //   { id: "marketing", name: "行銷專員", icon: <FaBullhorn />, color: "purple" },
  //   { id: "design", name: "設計師", icon: <FaLightbulb />, color: "pink" },
  //   { id: "sales", name: "業務銷售", icon: <FaBriefcase />, color: "orange" },
  //   { id: "finance", name: "財務會計", icon: <FaChartLine />, color: "green" },
  // ];

  // // 熱門地區
  // const popularLocations = [
  //   { city: "臺中市", name: "臺中市", icon: <FaMapMarkerAlt /> },
  //   { city: "臺北市", name: "臺北市", icon: <FaMapMarkerAlt /> },
  //   { city: "新北市", name: "新北市", icon: <FaMapMarkerAlt /> },
  //   { city: "桃園市", name: "桃園市", icon: <FaMapMarkerAlt /> },
  // ];

  // 熱門搜尋詞
  const trendingSearches = ["前端", "工程師", "UI/UX"];

  return (
    <div className="min-h-[calc(100vh-6rem)]">
      {/* 主視覺搜尋區域 */}
      <div className="bg-gradient-to-r from-mingdao-blue-dark to-mingdao-blue relative overflow-hidden">
        <div className="relative px-4 py-16 md:py-20 w-full max-w-6xl mx-auto">
          {/* 主標題 */}
          <div className="text-center mb-10 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              找到屬於您的
              <span className="text-[#09ffef]">理想職位</span>
            </h1>
            <p className="text-mingdao-blue-light text-lg md:text-xl max-w-2xl mx-auto">
              快速搜尋並找到符合您期望的工作機會
            </p>
          </div>

          {/* 搜尋框容器 */}
          <div
            className={`
            w-full max-w-3xl mx-auto transition-all duration-300
            ${isSearchExpanded ? "transform-gpu -translate-y-2" : ""}
          `}
          >
            <div className="bg-white rounded-xl shadow-xl p-4 md:p-5">
              <EnhancedSearch
                onExpandChange={(expanded) => setIsSearchExpanded(expanded)}
              />

              {/* 熱門搜尋詞 */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500 flex items-center">
                  <FaSearch className="mr-1" size={10} />
                  熱搜:
                </span>
                {trendingSearches.map((term, index) => (
                  <Link
                    href={`/search?q=${encodeURIComponent(term)}`}
                    key={index}
                    className="text-xs text-gray-600 hover:text-mingdao-blue transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="flex">
            <Image
              src="/images/discovery.png"
              alt="Discovery"
              width={313}
              height={28}
              className="mt-14 brightness-0 invert mx-auto"
            />
          </div>
        </div>
      </div>

      {/* 快捷搜尋區塊 */}
      {/* <div className="w-full bg-white">
        <div className="w-full max-w-6xl mx-auto mt-10 px-4">
          <div className="bg-white rounded-xl shadow-lg py-6 px-2 md:px-8 border-black border border-opacity-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1 p-3">
                <h3 className="text-lg font-semibold text-mingdao-blue-dark mb-4 flex items-center">
                  <FaBriefcase className="mr-2" />
                  熱門職業類別
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularCategories.map((category) => (
                    <Link
                      href={`/search?category=${category.id}`}
                      key={category.id}
                      className={`
                        flex items-center px-3 py-2 rounded-lg text-sm font-medium
                        ${category.color === 'blue' && 'bg-blue-50 text-blue-700 hover:bg-blue-100'}
                        ${category.color === 'purple' && 'bg-purple-50 text-purple-700 hover:bg-purple-100'}
                        ${category.color === 'pink' && 'bg-pink-50 text-pink-700 hover:bg-pink-100'}
                        ${category.color === 'orange' && 'bg-orange-50 text-orange-700 hover:bg-orange-100'}
                        ${category.color === 'green' && 'bg-green-50 text-green-700 hover:bg-green-100'}
                        transition-colors shadow-sm
                      `}
                    >
                      <span className="mr-1">{category.icon}</span>
                      {category.name}
                    </Link>
                  ))}
                  <Link
                    href="/categories"
                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors shadow-sm"
                  >
                    <FaRegStar className="mr-1" />
                    全部類別
                  </Link>
                </div>
              </div>

              <div className="col-span-2 md:col-span-1 p-3">
                <h3 className="text-lg font-semibold text-mingdao-blue-dark mb-4 flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  熱門工作地點
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                  {popularLocations.map((location) => (
                    <Link
                      href={`/search?city=${location.city}`}
                      key={location.city}
                      className="flex items-center px-3 py-3 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors shadow-sm"
                    >
                      <span className="mr-2 text-mingdao-blue">{location.icon}</span>
                      {location.name}
                    </Link>
                  ))}
                </div>

                <div className="mt-4 bg-mingdao-blue bg-opacity-20 rounded-lg p-3">
                  <Link
                    href="/search?remote=true"
                    className="flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-white text-mingdao-blue hover:bg-mingdao-blue hover:text-white transition-colors shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    遠端工作機會
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="w-full max-w-6xl mx-auto px-4 pt-12 pb-16">
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border-black border border-opacity-10">
            <JobList data={jobs} />
          </div>
        </div>
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border-black border border-opacity-10">
            <CompanyList data={companies} />
          </div>
        </div>
      </div>
    </div>
  );
}
