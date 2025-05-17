import { Suspense } from "react";
import HomePage from "@/components/Home/HomePage";
import { getJob, getCompany } from "@/app/_home/action/fetch";

export default async function Home() {
  // 服務器端獲取數據
  const jobs = await getJob();
  const companies = await getCompany();

  return (
    <Suspense fallback={<div className="h-[calc(100dvh-7rem)] flex items-center justify-center">載入中...</div>}>
      <HomePage jobs={jobs} companies={companies} />
    </Suspense>
  );
}