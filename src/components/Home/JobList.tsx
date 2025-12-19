import { Company, Job as TJob } from "@/prisma/client";
import { FaBriefcase } from "react-icons/fa";
import Job from "../Global/Object/Job";

type Props = {
  data: (TJob & { company: Company })[];
  className?: string;
};

export default function JobList(props: Props) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md ring-1 ring-slate-200 p-4 md:p-6 ${props.className}`}
    >
      <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center mb-4">
        <FaBriefcase className="mr-2 text-blue-600" /> 推薦職缺
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {props.data.map((jobData: TJob & { company: Company }, index) => (
          <Job key={index} data={jobData} size="sm" />
        ))}
      </div>
    </div>
  );
}
