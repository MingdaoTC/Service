import Button from "@/components/Global/Button/Button";
import { joinClass } from "@/library/joinClass";
import { Job as TJob } from "@/prisma/client";
import Link from "next/link";
import { AiOutlineMail } from "react-icons/ai";
import { BiBookmark } from "react-icons/bi";

export default function Job({
  data,
  className,
  size = "sm",
}: {
  data: TJob;
  className?: string;
  size?: "sm" | "lg";
}) {
  switch (size) {
    case "lg":
      return (
        <div
          className={joinClass(
            "px-5 py-4 border bg-white rounded-lg flex border-1 border-black border-opacity-20",
            className,
          )}
        >
          <div className="flex-grow">
            <Link href={`/job/${data.id}`}>
              <h2 className="text-lg text-mingdao-blue-dark font-extrabold line-clamp-1">
                {data.title}
              </h2>
            </Link>
            <div className="py-2">
              <p className="text-mingdao-blue-dark font-bold text-sm">
                {data.companyId}
              </p>
              <div className="flex flex-wrap text-sm">
                <p className="text-black font-bold pr-2 after:content-['|'] after:relative after:-right-2 after:text-mingdao-blue-light">
                  {data.location}
                </p>
                <p className="text-black font-bold px-2 after:content-['|'] after:relative after:-right-2 after:text-mingdao-blue-light">
                  {data.experience}
                </p>
                <p className="text-black font-bold pl-2">{data.education}</p>
              </div>
            </div>
            <p className="text-mingdao-blue font-semibold text-sm">
              月薪 {data.salaryMin} ~ {data.salaryMax} 元
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {/* <Button
              type="secondary"
              className="flex items-center gap-1 text-sm py-1 px-3"
            >
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
        <div className={`px-4 py-3 border bg-white rounded-lg ${className}`}>
          <Link href={`/job/${data.id}`}>
            <h2 className="text-base text-mingdao-blue-dark font-extrabold line-clamp-1">
              {data.title}
            </h2>
          </Link>
          <div className="py-2">
            <p className="text-mingdao-blue-dark font-bold text-sm">
              {data.companyId}
            </p>
            <div className="flex flex-wrap text-xs">
              <p className="text-black font-bold pr-2 after:content-['|'] after:relative after:-right-2 after:text-mingdao-blue-light">
                {data.location}
              </p>
              <p className="text-black font-bold px-2 after:content-['|'] after:relative after:-right-2 after:text-mingdao-blue-light">
                {data.experience}
              </p>
              <p className="text-black font-bold pl-2">{data.education}</p>
            </div>
          </div>
          <p className="text-mingdao-blue font-semibold text-xs">
            月薪 {data.salaryMin} ~ {data.salaryMax} 元
          </p>
        </div>
      );
    default:
      return (
        <div className={`px-4 py-3 border bg-white rounded-lg ${className}`}>
          <Link href={`/job/${data.id}`}>
            <h2 className="text-base text-mingdao-blue-dark font-extrabold line-clamp-1">
              {data.title}
            </h2>
          </Link>
          <div className="py-2">
            <p className="text-mingdao-blue-dark font-bold text-sm">
              {data.companyId}
            </p>
            <div className="flex flex-wrap text-xs">
              <p className="text-black font-bold pr-2 after:content-['|'] after:relative after:-right-2 after:text-mingdao-blue-light">
                {data.location}
              </p>
              <p className="text-black font-bold px-2 after:content-['|'] after:relative after:-right-2 after:text-mingdao-blue-light">
                {data.experience}
              </p>
              <p className="text-black font-bold pl-2">{data.education}</p>
            </div>
          </div>
          <p className="text-mingdao-blue font-semibold text-xs">
            月薪 {data.salaryMin} ~ {data.salaryMax} 元
          </p>
        </div>
      );
  }
}
