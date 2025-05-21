"use client";

import { getJobCategory } from "@/app/_home/action/fetch";
import {
  getAllCities,
  getDistrictsByCity,
} from "@/app/enterprise/_enterprise/action/fetchTaiwanData";
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
    // 如果提供了 onExpandChange 屬性，則調用它
    if (props.onExpandChange) {
      props.onExpandChange(isExpanded);
    }
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
        // 獲取工作類別
        const categories = await getJobCategory();
        if (categories) {
          setJobCategories(categories);
        }

        // 如果在搜尋頁面，從URL更新搜尋條件
        if (pathname === "/search") {
          const query = searchParams.get("q");
          const categoryParam = searchParams.get("category");
          const cityParam = searchParams.get("city");
          const districtParam = searchParams.get("district");

          if (query) {
            setKeyword(query);
          }
          if (categoryParam) {
            setCategory(categoryParam);
          }

          if (cityParam) {
            setCityChoose(cityParam);
            const districts = getDistrictsByCity(cityParam);
            setTaiwanDistrictList(districts);

            if (districtParam) {
              setDistrictChoose(districtParam);
            }
          }

          // 如果有任何高級搜尋參數，展開高級搜尋
          if (categoryParam || cityParam || districtParam) {
            setIsExpanded(true);
          }
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
    // 構建查詢參數
    const params = new URLSearchParams();
    if (keyword) {
      params.set("q", keyword);
    }
    if (category) {
      params.set("category", category);
    }
    if (cityChoose) {
      params.set("city", cityChoose);
      if (districtChoose) {
        params.set("district", districtChoose);
      }
    }

    // 導航到搜尋頁面
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div
      className="flex flex-col rounded-lg p-2 backdrop-blur-md border border-mingdao-blue"
      style={{ background: "rgba(255, 255, 255, 0.7)" }}
    >
      {/* 主要搜尋欄 */}
      <div className="flex flex-row items-center justify-start gap-1">
        <input
          type="text"
          className="text-gray-900 text-xs sm:text-sm w-full p-2 outline-none bg-transparent"
          placeholder="關鍵字 (例如: 軟體工程師、明道中學)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="whitespace-nowrap rounded-md text-xs sm:text-sm px-2 py-1.5 bg-gray-100 text-gray-700"
        >
          {isExpanded ? "簡易搜尋" : "進階搜尋"}
        </Button>

        <Button
          onClick={handleSearch}
          className="whitespace-nowrap rounded-md text-xs sm:text-sm px-3 sm:px-6 py-1.5"
        >
          搜尋
        </Button>
      </div>

      {/* 進階搜尋選項 */}
      {isExpanded && (
        <div className="flex flex-col sm:flex-row gap-2 mt-2 pt-2 border-t border-gray-200">
          {/* 職業類別選擇 */}
          <div className="flex-1">
            <label
              className="block text-xs text-gray-700 mb-1"
              htmlFor="category"
            >
              職業類別
            </label>
            <select
              title="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs sm:text-sm p-2 border rounded-md bg-white"
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
              <label
                className="block text-xs text-gray-700 mb-1"
                htmlFor="city"
              >
                縣市
              </label>
              <select
                title="city"
                value={cityChoose}
                onChange={handleCityChange}
                className="w-full text-xs sm:text-sm p-2 border rounded-md bg-white"
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
              <label
                className="block text-xs text-gray-700 mb-1"
                htmlFor="district"
              >
                地區
              </label>
              <select
                title="district"
                value={districtChoose}
                onChange={(e) => setDistrictChoose(e.target.value)}
                className="w-full text-xs sm:text-sm p-2 border rounded-md bg-white"
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
      )}
    </div>
  );
}
