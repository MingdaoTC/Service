"use client";

import { countJobs } from "@/components/Global/Object/_object/count";
import type { CompanyCategory, Company as TCompany } from "@/prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiBuildings, BiMap } from "react-icons/bi";

type Props = {
  data: TCompany & { category: CompanyCategory | null };
  className?: string;
};

const CDN_URL: string = process.env.NEXT_PUBLIC_S3_BUCKET_PUBLIC_URL as string;

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
      className={`bg-white rounded-2xl ring-1 ring-slate-200 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50/40 hover:shadow-lg ${props.className}`}
    >
      <div className="flex gap-2 items-center px-3 pt-3">
        <div className="min-w-14 min-h-14 sm:min-w-16 sm:min-h-16 w-14 h-14 sm:w-16 sm:h-16 rounded-lg ring-1 ring-slate-200 p-1 flex-shrink-0 aspect-square bg-white">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${CDN_URL + props.data.logoUrl})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
        </div>
        <h2 className="text-base text-slate-800 font-bold line-clamp-2">
          {props.data.name}
        </h2>
      </div>

      <div className="py-2 px-3 flex-grow">
        <div className="flex gap-1 items-center text-xs sm:text-sm text-slate-700">
          <BiMap size={"1em"} />
          <span className="truncate">{props.data.address}</span>
        </div>
        <div className="flex gap-1 items-center text-xs sm:text-sm text-slate-700">
          <BiBuildings size={"1em"} />
          <span className="truncate">{props.data.category?.name}</span>
        </div>
        <div className="flex gap-1 py-1 flex-wrap">
          {props.data.tags.map((tag: any, index: any) => (
            <span
              className="ring-1 ring-slate-200 bg-slate-50 px-2 py-[2px] rounded-md text-xs text-slate-600"
              key={index}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="w-full text-center text-white bg-gradient-to-r from-blue-600 to-blue-600 rounded-b-2xl py-2 text-sm cursor-pointer mt-auto transition-all duration-300 hover:opacity-90">
        <Link
          className="block w-full h-full"
          href={`/company/${props.data.id}`}
        >
          查看工作機會 ({jobsNum})
        </Link>
      </div>
    </div>
  );
}
