"use client";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import Job from "@/components/Global/Object/Job";
import { joinClass } from "@/library/joinClass";

const testJobData = {
  title: "硬體研發工程師(伺服器及工作站)",
  company: "華碩電腦股份有限公司",
  location: "台北市北投區",
  seniority: "兩年以上",
  education: "大學",
  salary: "999999",
};

const SearchResult = () => {
  const _blockGap = "gap-14";
  const jobListBlockGap = "gap-6";

  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    if (!query) {
      redirect("/");
    }
  }, [query]);

  return (
    <div className="w-full flex flex-col align-center px-8">
      <div className="py-4">Search Result of {query}</div>
      <div className={joinClass("flex flex-col", jobListBlockGap)}>
        {new Array(7).fill(testJobData).map((data, index) => (
          <Job key={index} data={data} size="lg" />
        ))}
      </div>
    </div>
  );
};

export default SearchResult;
