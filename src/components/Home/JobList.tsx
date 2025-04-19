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
      className={`border p-3 md:p-5 shadow-md bg-white rounded-lg ${props.className}`}
    >
      <h1 className="text-lg mb-2 md:mb-3 flex gap-1.5 items-center text-black font-bold">
        <BiBriefcase
          color="#00A3FF"
          size={"1.2em"}
          className="translate-y-[0.05em]"
        />
        推薦職缺
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {props.data.map((jobData, index) => (
          <Job key={index} data={jobData} size="sm" />
        ))}
      </div>
    </div>
  );
}