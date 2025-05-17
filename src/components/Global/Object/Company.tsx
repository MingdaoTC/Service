"use client";

import type { CompanyCategory, Company as TCompany } from "@/prisma/client";
import Link from "next/link";
import { BiMap } from "react-icons/bi";
import { BiBuildings } from "react-icons/bi";
import { useState, useEffect } from "react";
import { countJobs } from "@/components/Global/Object/_object/count";

type Props = {
  data: TCompany & { category: CompanyCategory | null };
  className?: string;
};

export default function Company(props: Props) {
  const [jobsNum, setJobsNum] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const jobs = await countJobs({ companyId: props.data.id });
      setJobsNum(jobs);
    })();
  }, [props.data.id]);

  return (
    <div
      className={`border bg-white rounded-lg border-1 border-black border-opacity-10 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:bg-gray-50 hover:shadow-md ${props.className}`}
    >
      <div className="flex gap-2 items-center px-3 pt-3">
        <div className="min-w-14 min-h-14 sm:min-w-16 sm:min-h-16 w-14 h-14 sm:w-16 sm:h-16 rounded-md border p-1 flex-shrink-0 aspect-square">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${process.env.NEXT_PUBLIC_CDN_URL! + props.data.logoUrl})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
        </div>
        <h2 className="text-base text-mingdao-blue-dark font-bold line-clamp-2">
          {props.data.name}
        </h2>
      </div>
      <div className="py-2 px-3 flex-grow">
        <div className="flex gap-1 items-center text-xs sm:text-sm">
          <BiMap color="gray" size={"1em"} />
          <span className="truncate">{props.data.address}</span>
        </div>
        <div className="flex gap-1 items-center text-xs sm:text-sm">
          <BiBuildings color="gray" size={"1em"} />
          <span className="truncate">
            {props.data.category?.name}
          </span>
        </div>
        <div className="flex gap-1 py-1 flex-wrap">
          {props.data.tags.map((tag: any, index: any) => {
            return (
              <span
                className="border px-1.5 py-[1px] rounded-md text-xs text-gray-500"
                key={index}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>
      <div className="w-full text-center text-white bg-mingdao-blue-dark rounded-b-lg py-2 text-sm cursor-pointer mt-auto transition-all duration-300 hover:bg-mingdao-blue-dark/90">
        <Link className="block w-full h-full" href={`/company/${props.data.id}`}>
          查看工作機會 ({jobsNum})
        </Link>
      </div>
    </div>
  );
}