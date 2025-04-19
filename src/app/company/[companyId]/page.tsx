import { Content } from "@/components/Company/Content";
import HeaderBar from "@/components/Global/Header/HeaderBar";
import Info from "@/components/Company/Info";
import Other from "@/components/Global/Other";
import { Company } from "@/types/Company";
import { joinClass } from "@/modules/joinClass";
import Job from "@/components/Global/Job";

const testCompanyData0 = {
  name: "華碩電腦股份有限公司",
  description: "電腦製造業",
  category: "電腦製造業",
  tags: ["電腦製造業", "電腦服務業", "電子商務業"],
  logo: "",
  address: "台北市北投區",
  detail:
    "身為全球科技領導品牌，華碩致力傳遞無與倫比的體驗，為世人擘劃美好數位生活藍圖。以進化式創新構築明日科技藍圖聞名，並持續以使用者為中心，打造最別出心裁、直覺易用的產品與解決方案。不斷再造進化的華碩深具雄心壯志，開創諸多令人驚艷的電競、創作者、AIoT與雲端計算解決方案，克服用戶痛點並傳遞無所不在的幸福感。",
};

const testCompanyData1 = {
  name: "英屬維京群島商太古可口可樂(股)公司台灣分公司",
  description: "飲料製造業",
  category: "飲料製造業",
  tags: ["其他客服人員", "國內業務", "國外業務"],
  logo: "https://cdn.lazco.dev/cocacola.png",
  address: "桃園市桃園區",
};

const testJobData = {
  title: "硬體研發工程師(伺服器及工作站)",
  company: "華碩電腦股份有限公司",
  location: "台北市北投區",
  seniority: "兩年以上",
  education: "大學",
  salary: "999999",
};

export default function companyID() {
  const blockGap = "gap-14";
  const jobListBlockGap = "gap-6";

  return (
    <>
      <Info data={testCompanyData0} />
      <div
        className={joinClass(
          "w-[90dvw] m-auto my-[5dvh] flex flex-col",
          blockGap
        )}
      >
        <div className={joinClass("grid grid-cols-3", blockGap)}>
          <div className="grid-cols-subgrid col-start-1 col-end-3 flex flex-col">
            <Content data={testCompanyData0} className="" />
          </div>
          <div className="grid-cols-subgrid col-start-3">
            <Other<Company>
              title="適合你的其他公司"
              data={[testCompanyData1, testCompanyData1, testCompanyData1]}
              contentKey={{ title: "name", content0: "address" }}
              className="h-full"
            />
          </div>
        </div>
        <div className={joinClass("flex flex-col", jobListBlockGap)}>
          {new Array(7).fill(testJobData).map((data, index) => (
            <Job key={index} data={data} size="lg" />
          ))}
        </div>
      </div>
    </>
  );
}
