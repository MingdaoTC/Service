import SimpleSearch from "@/components/Global/Search/SimpleSearch";
import CompanyList from "@/components/Home/CompanyList";
import JobList from "@/components/Home/JobList";

import { CompanyCategory, JobCategory } from "@/prisma/client";
import { getJob, getCompany, getCompanyCategory, getJobCategory } from "@/app/_home/action/fetch";

export default async function Home() {
  const jobs = await getJob();
  const companies = await getCompany();

  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)]">
      <div className="bg-mingdao-blue-light min-h-[10rem] md:h-60 p-3 md:p-6 flex justify-center items-start">
        <div className="w-full max-w-2xl">
          <SimpleSearch />
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:gap-4 w-[98%] sm:w-[95%] max-w-5xl mx-auto my-3 md:my-4 relative -top-20 sm:-top-14 md:-top-32">
        <JobList data={jobs} />
        <CompanyList data={companies} />
      </div>
    </div>
  );
}