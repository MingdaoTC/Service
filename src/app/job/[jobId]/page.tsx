import { auth } from "@/lib/auth/auth";
import { User } from "@/prisma/client";

// Components
import Content from "@/components/Job/Content";
import Info from "@/components/Job/Info";
import Other from "@/components/Global/Object/Other";
import Requirement from "@/components/Job/Requirement";
import { Job } from "@/types/Job";

const testRecommendedJobData = {
  _id: "1",
  title: "硬體研發工程師(伺服器及工作站)",
  company: "華碩電腦股份有限公司",
  location: "台北市北投區",
  seniority: "兩年以上",
  education: "大學",
  salary: "999999",
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

  const blockGap = "gap-8";

  return (
    <>
      <Info isLogin={!!user} data={testRecommendedJobData} />
      <div className="grid grid-cols-3 gap-14 w-[90dvw] m-auto my-[5dvh]">
        <div
          className={`grid-cols-subgrid col-start-1 col-end-3 flex flex-col ${blockGap}`}
        >
          <Content data={testJobData.detail} className="" />
          <Requirement data={testJobData.requirement} className="" />
        </div>
        <div className="grid-cols-subgrid col-start-3">
          <Other<Job>
            title="適合你的其他職缺"
            data={[
              testRecommendedJobData,
              testRecommendedJobData,
              testRecommendedJobData,
            ]}
            contentKey={{ title: "title", content0: "company" }}
          />
        </div>
      </div>
    </>
  );
}
