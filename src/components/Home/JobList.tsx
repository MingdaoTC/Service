import { BiBriefcase } from "react-icons/bi";

import Job from "../Global/Job";
import { Job as TJob } from "@/types/Job";

type Props = {
  data: TJob[];
  className?: string;
};

export default function JobList(props: Props) {
  return (
    <div
      className={`border p-4 md:p-8 shadow-lg bg-white rounded-xl ${props.className}`}
    >
      <h1 className="text-xl mb-3 md:mb-5 flex gap-2 items-center text-black font-bold">
        <BiBriefcase
          color="#00A3FF"
          size={"1.25em"}
          className="translate-y-[0.05em]"
        />
        推薦職缺
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {props.data.map((jobData, index) => (
          <Job key={index} data={jobData} size="sm" />
        ))}
      </div>
    </div>
  );
}