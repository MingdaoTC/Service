import { Content } from "@/components/Company/Content";
import Info from "@/components/Company/Info";
import Other from "@/components/Global/Object/Other";
import type { Company } from "@/prisma/client";
import { joinClass } from "@/modules/joinClass";
import Job from "@/components/Global/Object/Job";

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
      <Info data={{ ...testCompanyData0 }} />
      <div
        className={joinClass(
          "w-[90dvw] m-auto my-[5dvh] flex flex-col",
          blockGap
        )}
      >
        <div className={joinClass("grid grid-cols-3", blockGap)}>
          <div className="grid-cols-subgrid col-start-1 col-end-3 flex flex-col">
            <Content
              data={{ ...testCompanyData0 }}
              className=""
            />
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
