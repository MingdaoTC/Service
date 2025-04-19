// Components
import JobList from "@/components/Home/JobList";
import CompanyList from "@/components/Home/CompanyList";
import SimpleSearch from "@/components/Global/Search/SimpleSearch";

const testCompanyData = {
  name: "英屬維京群島商太古可口可樂(股)公司台灣分公司",
  address: "桃園市桃園區",
  ccategoryId: "飲料製造業",
  tags: ["其他客服人員", "國內業務", "國外業務"],
  logoUrl: "https://cdn.lazco.dev/cocacola.png",
};

const testJobData = {
  id: "1",
  title: "硬體研發工程師(伺服器及工作站)",
  company: "華碩電腦股份有限公司",
  location: "台北市北投區",
  experience: "兩年以上",
  education: "大學",
  salaryMin: "60000",
  salaryMax: "999999",
};

export default function Home() {
  return (
    <>
      {/* 縮小高度的 hero section */}
      <div className="bg-mingdao-blue-light min-h-[10rem] md:h-60 p-3 md:p-6 flex justify-center items-start">
        <div className="w-full max-w-2xl">
          <SimpleSearch />
        </div>
      </div>

      {/* 縮小間距並調整響應式位置 */}
      <div className="flex flex-col gap-3 sm:gap-4 w-[98%] sm:w-[95%] max-w-5xl mx-auto my-3 md:my-4 relative -top-20 sm:-top-14 md:-top-32">
        <JobList data={new Array(4).fill(testJobData)} />
        <CompanyList data={new Array(4).fill(testCompanyData)} />
      </div >
    </>
  );
}