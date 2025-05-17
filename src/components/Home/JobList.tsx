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
      className={`p-3 md:p-5 shadow-md bg-white rounded-lg ${props.className}`}
    >
      <h2 className="text-2xl font-bold text-mingdao-blue-dark flex items-center mb-4">
        <FaBriefcase className="mr-2" /> 推薦職缺
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {props.data.map((jobData: TJob & { company: Company }, index) => (
          <Job key={index} data={jobData} size="sm" />
        ))}
      </div>
    </div>
  );
}
