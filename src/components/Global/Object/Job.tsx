import Button from "@/components/Global/Button/Button";
import { joinClass } from "@/library/joinClass";
import { Company, Job as TJob } from "@/prisma/client";
import Link from "next/link";
import { AiOutlineMail } from "react-icons/ai";

export default function Job({
  data,
  className,
  size = "sm",
}: {
  data: TJob & { company: Company };
  className?: string;
  size?: "sm" | "lg";
}) {
  switch (size) {
    case "lg":
      return (
        <div
          className={joinClass(
            "px-5 py-4 bg-white rounded-2xl ring-1 ring-slate-200 flex transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50/40 hover:shadow-lg",
            className,
          )}
        >
          <div className="flex-grow">
            <Link href={`/job/${data.id}`}>
              <h2 className="text-lg text-slate-800 font-extrabold line-clamp-1">
                {data.title}
              </h2>
            </Link>
            <div className="py-2">
              <Link
                className="text-blue-700 font-semibold text-sm"
                href={`/company/${data.company?.id}`}
              >
                {data.company.name}
              </Link>
              <div className="flex flex-wrap text-sm text-slate-700">
                <p className="pr-2 after:content-['|'] after:mx-2 after:text-slate-300">
                  {data.address}
                </p>
                <p className="pr-2 after:content-['|'] after:mx-2 after:text-slate-300">
                  {data.experience}
                </p>
                <p>{data.education}</p>
              </div>
            </div>
            <p className="text-blue-600 font-semibold text-sm">
              月薪 {data.salaryMin} ~ {data.salaryMax} 元
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {/* <Button type="secondary" className="flex items-center gap-1 text-sm py-1 px-3">
              <BiBookmark className="translate-y-[1px]" />
              儲存
            </Button> */}
            <Button className="flex items-center gap-1 text-sm py-1 px-3" disabled>
              <AiOutlineMail className="translate-y-[0.5px]" />
              應徵
            </Button>
          </div>
        </div>
      );

    case "sm":
      return (
        <Link href={`/job/${data.id}`} className="cursor-pointer">
          <div
            className={`px-4 py-3 bg-white rounded-xl ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50/40 hover:shadow-lg ${className}`}
          >

            <h2 className="text-base text-slate-800 font-extrabold line-clamp-1">
              {data.title}
            </h2>
            <div className="py-2">
              <Link
                className="text-blue-700 font-semibold text-sm"
                href={`/company/${data.company.id}`}
              >
                {data.company.name}
              </Link>
              <div className="flex flex-wrap text-xs text-slate-700">
                <p className="pr-2 after:content-['|'] after:mx-2 after:text-slate-300">
                  {data.company.address}
                </p>
                <p className="pr-2 after:content-['|'] after:mx-2 after:text-slate-300">
                  {data.experience}
                </p>
                <p>{data.education}</p>
              </div>
            </div>
            <p className="text-blue-600 font-semibold text-xs">
              月薪 {data.salaryMin} ~ {data.salaryMax} 元
            </p>
          </div>
        </Link>
      );

    default:
      return (
        <div
          className={`px-4 py-3 bg-white rounded-xl ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50/40 hover:shadow-lg ${className}`}
        >
          <Link href={`/job/${data.id}`}>
            <h2 className="text-base text-slate-800 font-extrabold line-clamp-1">
              {data.title}
            </h2>
          </Link>
          <div className="py-2">
            <p className="text-blue-700 font-semibold text-sm">
              {data.company.name}
            </p>
            <div className="flex flex-wrap text-xs text-slate-700">
              <Link
                className="pr-2 after:content-['|'] after:mx-2 after:text-slate-300"
                href={`/company/${data.company.id}`}
              >
                {data.company.address}
              </Link>
              <p className="pr-2 after:content-['|'] after:mx-2 after:text-slate-300">
                {data.experience}
              </p>
              <p>{data.education}</p>
            </div>
          </div>
          <p className="text-blue-600 font-semibold text-xs">
            月薪 {data.salaryMin} ~ {data.salaryMax} 元
          </p>
        </div>
      );
  }
}
