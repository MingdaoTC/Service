import { BiBriefcase } from "react-icons/bi";

import Job from "../Global/Job";

const testJobData = {
  title: "硬體研發工程師(伺服器及工作站)",
  company: "華碩電腦股份有限公司",
  location: "台北市北投區",
  seniority: "兩年以上",
  education: "大學",
  salary: "999999",
};

export default function JobList() {
  return (
    <div className="px-6 py-4 shadow-lg bg-white rounded-xl w-[90dvw] m-auto relative -top-28">
      <h1 className="text-xl flex gap-2 items-center text-black font-bold">
        <BiBriefcase
          color="#00A3FF"
          size={"1.25em"}
          style={{ position: "relative", top: "-1px" }}
        ></BiBriefcase>{" "}
        推薦職缺
      </h1>
      <div className="flex flex-wrap gap-4 py-4">
        {new Array(6).fill(testJobData).map((jobData, index) => (
          <Job key={index} {...jobData} />
        ))}
      </div>
    </div>
  );
}
