import { getCompany, getJob } from "@/app/(main)/_home/action/fetch";
import HomePage from "@/components/Home/HomePage";
import { Suspense } from "react";

export default async function Page() {
  // 服務器端獲取數據
  const [jobs, companies] = await Promise.all([getJob(), getCompany()]);

  return (
    <Suspense
      fallback={
        <div className="h-[calc(100dvh-15rem)] flex items-center justify-center">
          <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white/70 px-4 py-3 shadow-sm">
            <span className="inline-block h-2 w-2 animate-ping rounded-full bg-blue-500" />
            <span className="text-sm text-slate-600">載入中…</span>
          </div>
        </div>
      }
    >
      <HomePage jobs={jobs} companies={companies} />
    </Suspense>
  );
}
