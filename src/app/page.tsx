// Components

import JobList from "@/components/Home/JobList";
import CompanyList from "@/components/Home/CompanyList";
// import SearchBox from "@/components/Global/SearchBox";
import SimpleSearch from "@/components/Global/SimpleSearch";

const testCompanyData = {
  name: "英屬維京群島商太古可口可樂(股)公司台灣分公司",
  location: "桃園市桃園區",
  category: "飲料製造業",
  tags: ["其他客服人員", "國內業務", "國外業務"],
  logo: "https://cdn.lazco.dev/cocacola.png",
};

const testJobData = {
  _id: "1",
  title: "硬體研發工程師(伺服器及工作站)",
  company: "華碩電腦股份有限公司",
  location: "台北市北投區",
  seniority: "兩年以上",
  education: "大學",
  salary: "999999",
};

export default function Home() {
  return (
    <>
      <div className="bg-mingdao-blue-light h-72 px-4 py-10 flex justify-center items-start">
        <SimpleSearch />
      </div>
      <div className="flex flex-col gap-8 w-[90dvw] my-8 mx-auto relative -top-28">
        <JobList data={new Array(7).fill(testJobData)} />
        <CompanyList data={new Array(5).fill(testCompanyData)} />
      </div>
    </>
  );
}
