"use client";

import { getJobCategory } from "@/app/(main)/_home/action/fetch";
import {
  getAllCities,
  getDistrictsByCity,
} from "@/app/(manage)/enterprise/_enterprise/action/fetchTaiwanData";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../Button/Button";

type TProps = {
  searchText?: string;
  category?: string;
  location?: string;
  onExpandChange?: (expanded: boolean) => void;
};

export default function EnhancedSearch(props: TProps) {
  const [keyword, setKeyword] = useState(props.searchText || "");
  const [category, setCategory] = useState(props.category || "");
  const [isExpanded, setIsExpanded] = useState(false);

  // 地區選擇相關狀態
  const [cityChoose, setCityChoose] = useState("");
  const [districtChoose, setDistrictChoose] = useState("");
  const [taiwanDistrictList, setTaiwanDistrictList] = useState<any[]>([]);

  // 職業類別相關狀態
  const [jobCategories, setJobCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 當展開狀態改變時，通知父組件
  useEffect(() => {
    if (props.onExpandChange) props.onExpandChange(isExpanded);
  }, [isExpanded, props]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 獲取台灣城市列表
  const taiwanCityList = getAllCities();

  // 初始化載入工作類別和處理URL參數
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const categories = await getJobCategory();
        if (categories) setJobCategories(categories);

        if (pathname === "/search") {
          const query = searchParams.get("q");
          const categoryParam = searchParams.get("category");
          const cityParam = searchParams.get("city");
          const districtParam = searchParams.get("district");

          if (query) setKeyword(query);
          if (categoryParam) setCategory(categoryParam);

          if (cityParam) {
            setCityChoose(cityParam);
            const districts = getDistrictsByCity(cityParam);
            setTaiwanDistrictList(districts);

            if (districtParam) setDistrictChoose(districtParam);
          }

          if (categoryParam || cityParam || districtParam) setIsExpanded(true);
        }
      } catch (error) {
        console.error("載入搜尋資料時發生錯誤:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchParams, pathname]);

  // 處理城市選擇變更
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = e.target.value;
    setCityChoose(selectedCity);
    setDistrictChoose("");

    if (selectedCity) {
      const districts = getDistrictsByCity(selectedCity);
      setTaiwanDistrictList(districts);
    } else {
      setTaiwanDistrictList([]);
    }
  };

  // 執行搜尋
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (category) params.set("category", category);
    if (cityChoose) {
      params.set("city", cityChoose);
      if (districtChoose) params.set("district", districtChoose);
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex flex-col rounded-2xl p-3 md:p-4 bg-white/95 backdrop-blur ring-1 ring-slate-200 shadow-md transition-all">
      {/* 主要搜尋欄 */}
      <div className="flex flex-row items-center justify-start gap-2">
        <input
          type="text"
          className="flex-1 text-slate-800 text-sm md:text-base px-3 py-2 rounded-lg border border-slate-200 bg-white/70 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="關鍵字 (例如: 軟體工程師、明道中學)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />

        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="whitespace-nowrap text-xs sm:text-sm px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all shadow"
          aria-expanded={isExpanded}
          aria-controls="advanced-search"
        >
          {isExpanded ? "簡易搜尋" : "進階搜尋"}
        </Button>

        <Button
          onClick={handleSearch}
          className="whitespace-nowrap text-xs sm:text-sm px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-500 text-white font-bold transition-all shadow max-md:hidden"
        >
          搜尋
        </Button>
      </div>
      <Button
        onClick={handleSearch}
        className="whitespace-nowrap text-xs sm:text-sm px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-500 text-white font-bold transition-all shadow md:hidden mt-2"
      >
        搜尋
      </Button>

      {/* 進階搜尋選項（絲滑展開） */}
      <div
        id="advanced-search"
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${isExpanded ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr] mt-0"
          }`}
        aria-hidden={!isExpanded}
      >
        <div
          className={`overflow-hidden border-t ${isExpanded ? "border-slate-200 pt-3" : "border-transparent pt-0"
            }`}
        >
          <div
            className={`flex flex-col sm:flex-row gap-2 ${isExpanded
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-1 pointer-events-none"
              } transition-all duration-300`}
          >
            {/* 職業類別選擇 */}
            <div className="flex-1">
              <label className="block text-xs text-slate-700 mb-1" htmlFor="category">
                職業類別
              </label>
              <select
                title="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs sm:text-sm p-2 border border-slate-200 rounded-md bg-white"
                disabled={isLoading}
              >
                <option value="">所有職業類別</option>
                {jobCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 地區選擇 */}
            <div className="flex-1 flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <label className="block text-xs text-slate-700 mb-1" htmlFor="city">
                  縣市
                </label>
                <select
                  title="city"
                  value={cityChoose}
                  onChange={handleCityChange}
                  className="w-full text-xs sm:text-sm p-2 border border-slate-200 rounded-md bg-white"
                >
                  <option value="">所有縣市</option>
                  {taiwanCityList.map((city: string) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-xs text-slate-700 mb-1" htmlFor="district">
                  地區
                </label>
                <select
                  title="district"
                  value={districtChoose}
                  onChange={(e) => setDistrictChoose(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2 border border-slate-200 rounded-md bg-white disabled:bg-slate-50"
                  disabled={!cityChoose}
                >
                  <option value="">所有地區</option>
                  {taiwanDistrictList.map((district: any) => (
                    <option key={district.name} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /進階搜尋選項 */}
    </div>
  );
}
