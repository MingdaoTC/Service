"use client";

// Module
import { useEffect, useState, useTransition } from "react";

// types
import { Company, CompanyCategory } from "@/prisma/client";

// Server Actions
import {
  getCompanyCategoryData,
  getCompanyData,
} from "@/app/(manage)/enterprise/_enterprise/action/fetch";
import {
  getAllCities,
  getDistrictsByCity,
} from "@/app/(manage)/enterprise/_enterprise/action/fetchTaiwanData";
import { handleUpdate } from "@/app/(manage)/enterprise/_enterprise/action/handleUpdate";

const CDN_URL = process.env.NEXT_PUBLIC_S3_BUCKET_PUBLIC_URL;

export default function CompanyProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<Array<CompanyCategory>>([]);
  const [logoUploading, setLogoUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [companyData, setCompanyData] = useState<Company>();
  const [newCompanyData, setNewCompanyData] = useState<Company>();
  const [tagInput, setTagInput] = useState("");
  const [defaultCityChoose, setDefaultCityChoose] = useState("");
  const [defaultDistrictChoose, setDefaultDistrictChoose] = useState("");
  const [cityChoose, setCityChoose] = useState("");
  const [districtChoose, setDistrictChoose] = useState("");
  const [taiwanDistrictList, setTaiwanDistrictList] = useState<[]>([]);
  const [defaultTaiwanDistrictList, setDefaultTaiwanDistrictList] = useState<
    []
  >([]);
  const taiwanCityList = getAllCities();

  useEffect(() => {
    (async () => {
      const category = await getCompanyCategoryData();
      if (!category) {
        throw new Error("無法獲取公司類別資料");
      }
      setCategories(category);
      try {
        const company = await getCompanyData();
        if (company) {
          setCompanyData(company);
          setNewCompanyData(company);
          const city = company.address?.split(" ")[0] || "";
          setCityChoose(city);
          setDefaultCityChoose(city);
          const district = company.address?.split(" ")[1] || "";
          setDistrictChoose(district);
          setDefaultDistrictChoose(district);

          const districts: any = getDistrictsByCity(city);
          setTaiwanDistrictList(districts);
          setDefaultTaiwanDistrictList(districts);
        }
      } catch (error) {
        console.error("獲取公司資料失敗:", error);
        setStatusMessage({
          type: "error",
          text: "無法載入公司資料",
        });
      }
      setIsLoading(false);
    })();
  }, []);

  // 處理表單變更
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    if (newCompanyData === undefined) {
      return;
    }
    const { name, value } = e.target;
    if (name === "published") {
      if (e.target instanceof HTMLInputElement) {
        setNewCompanyData({
          ...newCompanyData,
          [name]: e.target.checked,
        });
      }
      return;
    }

    if (name === "city") {
      const selectedCity: any = e.target.value;
      const districts: any = getDistrictsByCity(selectedCity);
      setTaiwanDistrictList(districts);
      setCityChoose(selectedCity);
      setDistrictChoose("");
      return;
    }

    if (name === "district") {
      const selectedDistrict: any = e.target.value;
      setDistrictChoose(selectedDistrict);
      setNewCompanyData({
        ...newCompanyData,
        address: `${cityChoose} ${selectedDistrict}`,
      });
      return;
    }

    setNewCompanyData({
      ...newCompanyData,
      [name]: value,
    });
  };

  // 處理數字輸入
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (newCompanyData === undefined) {
      return;
    }
    const { name, value } = e.target;
    setNewCompanyData({
      ...newCompanyData,
      [name]: value === "" ? 0 : Number.parseInt(value),
    });
  };

  // 處理標籤輸入變更
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  // 新增標籤
  const addTag = () => {
    if (newCompanyData === undefined) {
      return;
    }
    if (tagInput.trim() && !newCompanyData.tags.includes(tagInput.trim())) {
      setNewCompanyData({
        ...newCompanyData,
        tags: [...newCompanyData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  // 按下 Enter 也可以新增標籤
  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // 移除標籤
  const removeTag = (tagToRemove: string) => {
    if (newCompanyData === undefined) {
      return;
    }
    setNewCompanyData({
      ...newCompanyData,
      tags: newCompanyData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      uploadLogo(file);
    }
    e.target.value = "";
  };

  const uploadLogo = (file: File) => {
    if (!file) {
      return;
    }

    setLogoUploading(true);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/company/logo", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`上傳失敗: ${response.statusText}`);
        }

        const result = await response.json();

        if (result?.success) {
          if (newCompanyData === undefined) {
            return;
          }
          setStatusMessage({
            type: "success",
            text: "Logo 上傳成功！",
          });

          setNewCompanyData({
            ...newCompanyData,
            logoUrl: result.url,
          });
        } else {
          throw new Error(result.message || "上傳失敗");
        }
      } catch (error) {
        console.error("Logo 上傳失敗:", error);
        setStatusMessage({
          type: "error",
          text:
            typeof error === "string"
              ? error
              : error instanceof Error
                ? error.message
                : "Logo 上傳失敗，請稍後再試",
        });
      } finally {
        setLogoUploading(false);
        setTimeout(() => setStatusMessage(null), 3000);
      }
    });
  };

  // 處理表單提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        if (newCompanyData === undefined) {
          return;
        }
        const result = await handleUpdate(newCompanyData);
        if (result === "OK") {
          setCompanyData(newCompanyData);
          setStatusMessage({
            type: "success",
            text: "公司資料更新成功！",
          });
        }
      } catch (error) {
        console.error("更新過程中發生錯誤:", error);
        setStatusMessage({
          type: "error",
          text: "系統錯誤：更新過程中發生錯誤",
        });
      } finally {
        setTimeout(() => setStatusMessage(null), 3000);
      }
    });
  };

  // 格式化資本額顯示
  const formatCapital = (capital: number) => {
    return new Intl.NumberFormat("zh-TW").format(capital);
  };

  if (isLoading || !companyData || !newCompanyData) {
    return <></>;
  }

  return (
    <>
      <div className="w-full mx-auto h-full">
        {/* 狀態訊息 */}
        {statusMessage && (
          <div
            className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg ${statusMessage.type === "success"
              ? "bg-green-100 border-l-4 border-green-500"
              : "bg-red-100 border-l-4 border-red-500"
              } transition-all duration-500 ease-in-out`}
          >
            <div className="flex items-center">
              {statusMessage.type === "success" ? (
                <svg
                  className="h-6 w-6 text-green-500 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-red-500 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              <p
                className={
                  statusMessage.type === "success"
                    ? "text-green-700"
                    : "text-red-700"
                }
              >
                {statusMessage.text}
              </p>
            </div>
          </div>
        )}

        {/* 頁面標題 */}
        <div className="mb-6 bg-white shadow-sm rounded-lg border p-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-blue-800">
            公司資料管理
          </h1>
          <p className="text-gray-600 mt-1">更新您的公司基本資料和聯絡方式</p>
        </div>

        {/* 公司資料表單 */}
        <div className="bg-white shadow-sm rounded-lg border overflow-hidden mb-8">
          <form onSubmit={handleSubmit}>
            {/* 公司基本資料 */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                基本資料
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 公司 Logo */}
                <div className="lg:col-span-1">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="logo"
                  >
                    公司 Logo
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 flex flex-col items-center mb-6">
                    <div className="w-48 h-48 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {newCompanyData.logoUrl ? (
                        <img
                          src={CDN_URL + newCompanyData.logoUrl}
                          alt={newCompanyData.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-gray-400 text-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-auto h-12 w-12"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="mt-1 text-sm">尚未上傳 Logo</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <label
                        className={`flex items-center justify-center px-4 py-2 border ${logoUploading ? "bg-gray-200 cursor-not-allowed" : "border-blue-600 text-blue-600 hover:bg-blue-50 cursor-pointer"} rounded-md transition-colors`}
                      >
                        {logoUploading ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4 mr-2"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            上傳中...
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            選擇並上傳 Logo
                          </>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleLogoChange}
                          disabled={logoUploading}
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="published"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      發布公司
                    </label>
                    <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md">
                      <div className="flex items-center my-auto">
                        <label className="relative inline-flex items-center cursor-pointer my-auto h-full">
                          <input
                            type="checkbox"
                            id="published"
                            name="published"
                            checked={newCompanyData.published}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                        </label>

                        <span className="text-sm text-gray-600 ml-2">
                          目前狀態:{" "}
                          <span
                            className={
                              companyData.published
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            {companyData.published ? "已發布" : "未發布"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 右側基本資料 */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        公司名稱 (不可修改)
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={companyData.name}
                        // onChange={handleInputChange}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        統一編號 (不可修改)
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={companyData.unifiedNumber}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="categoryId"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        公司類別 <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="categoryId"
                        name="categoryId"
                        required
                        value={newCompanyData.categoryId || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                      >
                        <option value="">請選擇公司類別</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="capital"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        資本額 (新台幣)
                      </label>
                      <input
                        type="number"
                        id="capital"
                        name="capital"
                        min="0"
                        value={newCompanyData.capital || ""}
                        onChange={handleNumberChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                        placeholder="請輸入資本額"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        目前: {formatCapital(companyData.capital ?? 0)} 元
                      </p>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="numberOfEmployees"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      員工人數
                    </label>
                    <input
                      type="number"
                      id="numberOfEmployees"
                      name="numberOfEmployees"
                      min="0"
                      value={newCompanyData.numberOfEmployees || ""}
                      onChange={handleNumberChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                      placeholder="請輸入員工人數"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="tags"
                    >
                      公司標籤
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newCompanyData.tags.map((tag, index) => (
                        <div
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={handleTagInputChange}
                        onKeyPress={handleTagKeyPress}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-0"
                        placeholder="輸入標籤後按下 + 按鈕或 Enter"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      標籤可幫助求職者快速了解貴公司的特色和專業領域
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 聯絡資訊 */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                聯絡資訊
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    公司網站
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={newCompanyData.website || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    聯絡電話 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={newCompanyData.phone || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                    placeholder="例如: 02-12345678"
                  />
                </div>

                <div>
                  <label
                    htmlFor="fax"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    傳真號碼
                  </label>
                  <input
                    type="tel"
                    id="fax"
                    name="fax"
                    value={newCompanyData.fax || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                    placeholder="例如: 02-12345679"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    公司位置 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex w-full gap-2 mb-2">
                    <div className="flex-1">
                      <select
                        id="city"
                        name="city"
                        required
                        value={cityChoose}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                      >
                        <option value="">請選擇縣市</option>
                        {taiwanCityList.map((city: string) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <select
                        id="district"
                        name="district"
                        required
                        value={districtChoose}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                      >
                        <option value="">請選擇地區</option>
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

            {/* 公司介紹 */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                公司介紹
              </h2>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  公司簡介 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={6}
                  value={newCompanyData.description || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 resize-none"
                  placeholder="請簡要介紹貴公司的背景、業務範圍和企業文化等..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  字數: {(newCompanyData.description || "").length} / 推薦
                  300-500 字
                </p>
              </div>
            </div>

            {/* 提交按鈕 */}
            <div className="p-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setNewCompanyData(companyData);
                  setTagInput(companyData.tags.join(", "));
                  setCityChoose(defaultCityChoose);
                  setDistrictChoose(defaultDistrictChoose);
                  setTaiwanDistrictList(defaultTaiwanDistrictList);
                }}
                type="button"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                取消變更
              </button>
              <button
                type="submit"
                disabled={isPending}
                className={`px-6 py-2 ${isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                  } text-white rounded-md transition-colors flex items-center`}
              >
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    儲存中...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    儲存變更
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="h-[0.05rem]" />
      </div>
    </>
  );
}
