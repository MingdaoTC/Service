"use client";

// Module
import { useState, useTransition, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// types
import {
  Company,
  JobCategory,
  EmploymentType,
  Location,
  Job
} from "@/prisma/client";

// Server Actions
import { getCompanyData, getJobCategoryData, getJobById } from "@/app/enterprise/_enterprise/action/fetch";
import { handleUpdateJob } from "@/app/enterprise/_enterprise/action/handleUpdate";
import { getAllCities, getDistrictsByCity } from "@/app/enterprise/_enterprise/action/fetchTaiwanData";

export default function JobEditPage({
  params,
}: {
  params: { jobId: string };
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<Array<JobCategory>>([]);
  const [companyData, setCompanyData] = useState<Company>();
  const [jobData, setJobData] = useState<Job>();
  const [cityChoose, setCityChoose] = useState("");
  const [districtChoose, setDistrictChoose] = useState("");
  const [taiwanDistrictList, setTaiwanDistrictList] = useState<[]>([]);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const taiwanCityList = getAllCities();
  const router = useRouter();
  const jobId = params.jobId;

  // 工作經驗選項
  const experienceOptions = [
    "不拘",
    "無經驗可",
    "1年以下",
    "1-3年",
    "3-5年",
    "5-10年",
    "10年以上"
  ];

  // 學歷要求選項
  const educationOptions = [
    "不拘",
    "高中以上",
    "專科以上",
    "大學以上",
    "碩士以上",
    "博士以上"
  ];

  // 初始資料載入 useEffect (上一個階段的程式碼保持不變)
  useEffect(() => {
    (async () => {
      try {
        // 載入類別資料
        const categories = await getJobCategoryData();
        if (categories) {
          setCategories(categories);
        }

        // 載入公司資料
        const company = await getCompanyData();
        if (company) {
          setCompanyData(company);
        }

        // 載入職缺資料
        const job = await getJobById(jobId);
        if (job) {
          setJobData(job);

          // 設定地點相關狀態
          const addressParts = job.address?.split(" ") || [];
          if (addressParts.length >= 2) {
            const city = addressParts[0];
            const district = addressParts[1];
            setCityChoose(city);
            setDistrictChoose(district);

            // 載入對應城市的地區列表
            const districts: any = getDistrictsByCity(city);
            setTaiwanDistrictList(districts);
          }
        }
      } catch (error) {
        console.error("獲取資料失敗:", error);
        setStatusMessage({
          type: 'error',
          text: '無法載入職缺資料'
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [jobId]);

  // 薪資驗證函數
  const validateSalary = (salaryMin: number, salaryMax: number) => {
    // 無論是否面議，都必須有有效的薪資範圍
    if (salaryMin === 0 && salaryMax === 0) {
      return {
        valid: false,
        message: '薪資範圍不能同時為0，請輸入有效的薪資範圍'
      };
    }

    // 如果最大薪資小於最小薪資，返回錯誤
    if (salaryMax !== 0 && salaryMin !== 0 && salaryMax < salaryMin) {
      return {
        valid: false,
        message: '最高薪資不能低於最低薪資，請修正薪資範圍'
      };
    }

    // 薪資值有效
    return { valid: true };
  };

  // 處理輸入變更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!jobData) return;

    const { name, value } = e.target;

    if (name === "city") {
      const selectedCity: any = e.target.value;
      const districts: any = getDistrictsByCity(selectedCity);
      setTaiwanDistrictList(districts);
      setCityChoose(selectedCity);
      setDistrictChoose("");

      // 更新 jobData 的地址
      setJobData({
        ...jobData,
        address: `${selectedCity} `
      });
      return;
    }

    if (name === "district") {
      const selectedDistrict: any = e.target.value;
      setDistrictChoose(selectedDistrict);

      // 更新 jobData 的地址
      setJobData({
        ...jobData,
        address: `${cityChoose} ${selectedDistrict}`
      });
      return;
    }

    setJobData({
      ...jobData,
      [name]: value
    });
  };

  // 處理數字輸入變更
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!jobData) return;

    const { name, value } = e.target;
    const numberValue = value === "" ? 0 : parseInt(value);

    setJobData({
      ...jobData,
      [name]: numberValue
    });
  };

  // 處理Checkbox變更
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!jobData) return;

    const { name, checked } = e.target;
    setJobData({
      ...jobData,
      [name]: checked
    });
  };

  // 返回職缺列表
  const handleGoBack = () => {
    router.push("/enterprise/jobs");
  };

  // 提交表單
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        if (!jobData) return;

        const salaryValidation: any = validateSalary(
          jobData.salaryMin || 0,
          jobData.salaryMax || 0,
        );

        if (!salaryValidation.valid) {
          setStatusMessage({
            type: 'error',
            text: salaryValidation.message || ""
          });
          // 中止提交
          return;
        }

        const result = await handleUpdateJob(jobData);

        if (result === "OK") {
          setStatusMessage({
            type: 'success',
            text: '職缺更新成功！'
          });

          setTimeout(() => {
            router.push("/enterprise/jobs");
          }, 1000);
        } else {
          setStatusMessage({
            type: 'error',
            text: '更新職缺失敗，請稍後再試'
          });
        }
      } catch (error) {
        console.error('更新職缺時發生錯誤:', error);
        setStatusMessage({
          type: 'error',
          text: '系統錯誤：更新職缺時發生錯誤'
        });
      }
    });
  };

  // 格式化薪資顯示
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('zh-TW').format(num);
  };

  // 如果尚未載入資料，顯示空白
  if (isLoading || !jobData) return (<></>);

  return (
    <>
      <div className="w-full mx-auto h-full">
        {/* 狀態訊息 */}
        {statusMessage && (
          <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg ${statusMessage.type === 'success' ? 'bg-green-100 border-l-4 border-green-500' : 'bg-red-100 border-l-4 border-red-500'
            } transition-all duration-500 ease-in-out`}>
            <div className="flex items-center">
              {statusMessage.type === 'success' ? (
                <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <p className={statusMessage.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                {statusMessage.text}
              </p>
            </div>
          </div>
        )}

        {/* 頁面標題 */}
        <div className="mb-6 bg-white shadow-sm rounded-lg border p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-blue-800">
                編輯職缺
              </h1>
              <p className="text-gray-600 mt-1">修改未發佈或已發布的職缺資訊</p>
            </div>
            <button
              onClick={handleGoBack}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回列表
            </button>
          </div>
        </div>

        {/* 職缺表單 */}
        <div className="bg-white shadow-sm rounded-lg border overflow-hidden mb-8">
          <form onSubmit={handleSubmit}>
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                基本資訊
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    職缺標題 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={jobData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                    placeholder="例如：資深前端工程師"
                  />
                </div>

                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                    職缺類別 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    required
                    value={jobData.categoryId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                  >
                    <option value="">請選擇職缺類別</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
                    僱用類型 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="employmentType"
                    name="employmentType"
                    required
                    value={jobData.employmentType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                  >
                    <option value={EmploymentType.FULL_TIME}>全職</option>
                    <option value={EmploymentType.PART_TIME}>兼職</option>
                    <option value={EmploymentType.CONTRACT}>約聘</option>
                    <option value={EmploymentType.INTERNSHIP}>實習</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    工作模式
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={jobData.location || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                  >
                    <option value={Location.ONSITE}>現場辦公</option>
                    <option value={Location.REMOTE}>遠端工作</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  工作地點 <span className="text-red-500">*</span>
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-left flex-col">
                    <label htmlFor="negotiable" className="block text-sm font-medium text-gray-700 mb-1">
                      薪資面議
                    </label>
                    <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md">
                      <div className="flex items-center my-auto">
                        <label className="relative inline-flex items-center cursor-pointer my-auto h-full">
                          <input
                            type="checkbox"
                            id="negotiable"
                            name="negotiable"
                            checked={jobData.negotiable}
                            onChange={handleCheckboxChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                          <span className="ml-3 text-sm font-medium text-gray-700">
                            面議實際薪資
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-1">
                        最低薪資 (月薪/元) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="salaryMin"
                        name="salaryMin"
                        min="0"
                        required
                        value={jobData.salaryMin || ""}
                        onChange={handleNumberChange}
                        // disabled={jobData.negotiable}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0`}
                        placeholder="請輸入最低薪資"
                      />
                      {jobData.salaryMin > 0 && (
                        <p className="mt-1 text-xs text-gray-500">
                          約 {formatNumber(jobData.salaryMin)} 元
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-1">
                        最高薪資 (月薪/元) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="salaryMax"
                        name="salaryMax"
                        min="0"
                        required
                        value={jobData.salaryMax || ""}
                        onChange={handleNumberChange}
                        // disabled={jobData.negotiable}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0`}
                        placeholder="請輸入最高薪資"
                      />
                      {jobData.salaryMax > 0 && (
                        <p className="mt-1 text-xs text-gray-500">
                          約 {formatNumber(jobData.salaryMax)} 元
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="numberOfPositions" className="block text-sm font-medium text-gray-700 mb-1">
                    招聘人數
                  </label>
                  <input
                    type="number"
                    id="numberOfPositions"
                    name="numberOfPositions"
                    min="1"
                    value={jobData.numberOfPositions || ""}
                    onChange={handleNumberChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                    placeholder="請輸入招聘人數"
                  />
                </div>

                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    到職日期
                  </label>
                  <input
                    type="text"
                    id="startDate"
                    name="startDate"
                    value={jobData.startDate || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                    placeholder="例如：即日起、一個月內"
                  />
                </div>
              </div>
            </div>

            {/* 工作內容與要求 */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                工作內容與要求
              </h2>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  職缺描述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={6}
                  value={jobData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 resize-none"
                  placeholder="請詳細描述工作內容、職責和日常工作..."
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                  字數: {jobData.description.length} / 建議 100-500 字
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                    工作經驗要求
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={jobData.experience}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                  >
                    {experienceOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                    學歷要求
                  </label>
                  <select
                    id="education"
                    name="education"
                    value={jobData.education}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                  >
                    {educationOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">
                    科系要求
                  </label>
                  <input
                    type="text"
                    id="major"
                    name="major"
                    value={jobData.major || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                    placeholder="例如：資訊相關科系、不拘"
                  />
                </div>

                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                    語言能力要求
                  </label>
                  <input
                    type="text"
                    id="language"
                    name="language"
                    value={jobData.language || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                    placeholder="例如：英文聽說讀寫流利、日文初級"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                  專業技能要求
                </label>
                <textarea
                  id="skills"
                  name="skills"
                  rows={3}
                  value={jobData.skills || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 resize-none"
                  placeholder="例如：熟悉React、Node.js、熟悉SQL資料庫..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="management" className="block text-sm font-medium text-gray-700 mb-1">
                    管理責任
                  </label>
                  <input
                    type="text"
                    id="management"
                    name="management"
                    value={jobData.management || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                    placeholder="例如：需帶領3-5人團隊、無"
                  />
                </div>

                <div>
                  <label htmlFor="businessTrip" className="block text-sm font-medium text-gray-700 mb-1">
                    出差外派要求
                  </label>
                  <input
                    type="text"
                    id="businessTrip"
                    name="businessTrip"
                    value={jobData.businessTrip || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                    placeholder="例如：需海外出差、無"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="workingHours" className="block text-sm font-medium text-gray-700 mb-1">
                  工作時間
                </label>
                <input
                  type="text"
                  id="workingHours"
                  name="workingHours"
                  value={jobData.workingHours || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                  placeholder="例如：週一至週五 9:00-18:00、彈性工時"
                />
              </div>
            </div>
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                福利與其他資訊
              </h2>

              <div className="mb-4">
                <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-1">
                  員工福利
                </label>
                <textarea
                  id="benefits"
                  name="benefits"
                  rows={4}
                  value={jobData.benefits || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 resize-none"
                  placeholder="例如：三節獎金、年終獎金、員工旅遊、健保、勞保..."
                ></textarea>
              </div>

              <div>
                <label htmlFor="others" className="block text-sm font-medium text-gray-700 mb-1">
                  其他說明
                </label>
                <textarea
                  id="others"
                  name="others"
                  rows={4}
                  value={jobData.others || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 resize-none"
                  placeholder="其他您想補充的資訊..."
                ></textarea>
              </div>
            </div>

            {/* 發布選項 */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                發布選項
              </h2>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={jobData.published}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                  立即發布職缺
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                未勾選則保存為草稿，您可以稍後再發布
              </p>
            </div>
            <div className="p-6 flex justify-end space-x-3">
              <button
                onClick={handleGoBack}
                type="button"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                取消
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
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    處理中...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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