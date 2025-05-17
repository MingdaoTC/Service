import { auth } from "@/library/auth";
import { User } from "@/prisma/client";

import Other from "@/components/Global/Object/Other";
// Components
import Content from "@/components/Job/Content";
import Info from "@/components/Job/Info";
import Requirement from "@/components/Job/Requirement";
import { EmploymentType, Job, Location } from "@/prisma/client";

const testRecommendedJobData = {
  createdAt: new Date(),
  updatedAt: new Date(),
  id: "1",
  description: "硬體研發工程師相關職缺描述",
  title: "硬體研發工程師(伺服器及工作站)",
  companyId: "華碩電腦股份有限公司",
  company: "華碩電腦股份有限公司",
  categoryId: "硬體研發",
  salaryMin: 40000,
  salaryMax: 999999,
  negotiable: true,
  employmentType: EmploymentType.CONTRACT,
  location: Location.REMOTE,
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

const testJobData = {
  detail: {
    description:
      "繪製 Server、workstation 板卡線路圖\nLayout Placement & Layout Check\n操作 EE Design 相關系統\n測試、維修與 Debug Sample 板\n量測 Sample 板訊號與 Tuning\n協同 Support Team 解決問題\n解決量產後客訴問題",
    category: "硬體研發工程師、電子工程師",
    salary: "待遇面議 (經常性薪資達 4 萬元或以上)",
    nature: "全職",
    location: "台北市北投區",
    responsibility: "不需負擔管理責任",
    commute: "無須出差外派",
    workTime: "日班",
    holiday: "依公司規定",
    workday: "一週內",
    peopleRequired: "不限",
  },
  requirement: {
    experience: "2 年以上",
    education: "大學、碩士",
    major: "不拘",
    language: "不拘",
    skill: "不拘",
    ability: "不拘",
    other:
      "具 1 年以上主機板設計經驗為佳\n薪資會依據學經歷背景及相關工作經驗核薪",
  },
};

export default async function JobPage() {
  const session = await auth();
  // @ts-ignore
  const user: User | null = session?.user || null;

  return (
    <div className="">
      <Info isLogin={!!user} data={testRecommendedJobData} />
      <div className="w-[98%] sm:w-[95%] max-w-5xl mx-auto my-3 md:my-4">
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
          <div className="w-full lg:w-3/4 flex flex-col gap-3 md:gap-4">
            <Content data={testJobData.detail} className="w-full" />
            <Requirement data={testJobData.requirement} className="w-full" />
          </div>
          {/* <div className="w-full lg:w-1/4">
            <Other<Job>
              title="適合你的其他職缺"
              data={[
                testRecommendedJobData,
                testRecommendedJobData,
                testRecommendedJobData,
              ]}
              contentKey={{ title: "title", content0: "company" }}
              className="h-full"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
}
