import Link from "next/link";

import { AiOutlineMail } from "react-icons/ai";
import { BiBookmark } from "react-icons/bi";

import Button from "@/components/Global/Button";
import { joinClass } from "@/modules/joinClass";
import { Job as TJob } from "@customTypes/Job";

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
            "px-8 py-6 border bg-white rounded-xl flex",
            className
          )}
        >
          <div className="flex-grow">
            <Link href={`/job/${data._id}`}>
              <h2 className="text-xl text-mingdao-blue-dark font-extrabold">
                {data.title}
              </h2>
            </Link>
            <div className="py-4">
              <p className="text-mingdao-blue-dark font-bold">{data.company}</p>
              <div className="flex">
                <p className="text-black font-bold pr-2 after:content-['|'] after:relative after:-right-2 after:text-mingdao-blue-light">
                  {data.location}
                </p>
                <p className="text-black font-bold px-2 after:content-['|'] after:relative after:-right-2 after:text-mingdao-blue-light">
                  {data.seniority}
                </p>
                <p className="text-black font-bold pl-2">{data.education}</p>
              </div>
            </div>
            <p className="text-mingdao-blue font-semibold">
              月薪 {data.salary} 元
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Button
              type="secondary"
              className="flex items-center gap-2 text-[1.3rem]"
            >
              <BiBookmark className="translate-y-[1px]" />
              儲存
            </Button>
            <Button className="flex items-center gap-2 text-[1.3rem]">
              <AiOutlineMail className="translate-y-[0.5px]" />
              應徵
            </Button>
          </div>
        </div>
      );

    case "sm":
      return (
        <div className={`px-6 py-4 border bg-white rounded-xl ${className}`}>
          <Link href={`/job/${data._id}`}>
            <h2 className="text-xl text-mingdao-blue-dark font-extrabold">
              {data.title}
            </h2>
          </Link>
          <div className="py-4">
            <p className="text-mingdao-blue-dark font-bold">{data.company}</p>
            <div className="flex">
              <p className="text-black font-bold pr-2 after:content-['|'] after:relative after:-right-2 after:text-mingdao-blue-light">
                {data.location}
              </p>
              <p className="text-black font-bold px-2 after:content-['|'] after:relative after:-right-2 after:text-mingdao-blue-light">
                {data.seniority}
              </p>
              <p className="text-black font-bold pl-2">{data.education}</p>
            </div>
          </div>
          <p className="text-mingdao-blue font-semibold">
            月薪 {data.salary} 元
          </p>
        </div>
      );
    default:
      return (
        <div className={`px-6 py-4 border bg-white rounded-xl ${className}`}>
          <Link href={`/job/${data._id}`}>
            <h2 className="text-xl text-mingdao-blue-dark font-extrabold">
              {data.title}
            </h2>
          </Link>
          <div className="py-4">
            <p className="text-mingdao-blue-dark font-bold">{data.company}</p>
            <div className="flex">
              <p className="text-black font-bold pr-2 after:content-['|'] after:relative after:-right-2 after:text-mingdao-blue-light">
                {data.location}
              </p>
              <p className="text-black font-bold px-2 after:content-['|'] after:relative after:-right-2 after:text-mingdao-blue-light">
                {data.seniority}
              </p>
              <p className="text-black font-bold pl-2">{data.education}</p>
            </div>
          </div>
          <p className="text-mingdao-blue font-semibold">
            月薪 {data.salary} 元
          </p>
        </div>
      );
  }
}
