import { Content } from "@/components/Company/Content";
import Info from "@/components/Company/Info";
import Job from "@/components/Global/Object/Job";
import Other from "@/components/Global/Object/Other";
import type { Company } from "@/prisma/client";

const testCompanyData0: Company = {
  id: "1",
  name: "華碩電腦股份有限公司",
  description: "電腦製造業",
  categoryId: "computer-manufacturing",
  tags: ["電腦製造業", "電腦服務業", "電子商務業"],
  logoUrl: "",
  address: "台北市北投區",
  capital: null,
  website: null,
  phone: null,
  fax: null,
  email: null,
  numberOfEmployees: null,
};

const testCompanyData1: Company = {
  id: "2",
  name: "英屬維京群島商太古可口可樂(股)公司台灣分公司",
  description: "飲料製造業",
  categoryId: "beverage",
  logoUrl: "https://cdn.lazco.dev/cocacola.png",
  address: "桃園市桃園區",
  tags: ["飲料製造業", "飲料服務業", "電子商務業"],
  capital: null,
  website: null,
  phone: null,
  fax: null,
  email: null,
  numberOfEmployees: null,
};

const testJobData = {
  id: "1",
  description: "硬體研發工程師相關職缺描述",
  title: "硬體研發工程師(伺服器及工作站)",
  companyId: "華碩電腦股份有限公司",
  company: "華碩電腦股份有限公司",
  categoryId: "硬體研發",
  salaryMin: 40000,
  salaryMax: 999999,
  negotiable: true,
  employmentType: "contract",
  location: "台北市北投區",
  seniority: "兩年以上",
  education: "大學",
  salary: "待遇面議 (經常性薪資達 4 萬元或以上)",
  benefits: null,
  management: "無需負擔管理責任",
  businessTrip: "無須出差外派",
  workingHours: "日班",
  startDate: "一週內",
  holiday: "依公司規定",
  peopleRequired: "不限",
  numberOfPositions: 1,
  experience: "兩年以上",
  major: "不拘",
  language: "不拘",
  skills: null,
  others: null,
};

export default function companyID() {
  return (
    <>
      <Info data={{ ...testCompanyData0 }} />
      <div className="w-[98%] sm:w-[95%] max-w-5xl mx-auto my-3 md:my-4">
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="w-full lg:w-3/4">
            <Content data={{ ...testCompanyData0 }} className="w-full" />
          </div>
          <div className="w-full lg:w-1/4">
            <Other<Company>
              title="適合你的其他公司"
              data={[testCompanyData1, testCompanyData1, testCompanyData1]}
              contentKey={{ title: "name", content0: "address" }}
              className="h-full"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:gap-3">
          <h2 className="text-xl font-bold text-mingdao-blue-dark mb-1 md:mb-2">
            公司職缺列表
          </h2>
          {new Array(7).fill(testJobData).map((data, index) => (
            <Job key={index} data={data} size="lg" />
          ))}
        </div>
      </div>
    </>
  );
}
