import { auth } from "@/library/auth";
import { Company, Job, Resume, User } from "@/prisma/client";

import Content from "@/components/Job/Content";
import Info from "@/components/Job/Info";
import { getResumeListByUserEmail } from "@/library/actions/getResumeList";
import { notFound } from "next/navigation";
import { getCompanyById } from "./_job/actions/getCompany";
import { getJobById } from "./_job/actions/getJob";

export default async function JobPage({
  params,
}: {
  params: { jobId: string };
}) {
  const user = (await auth())?.user as User;
  const jobId = params.jobId;

  if (!jobId) {
    notFound();
  }

  const job = (await getJobById(jobId)) as Job;

  if (!job) {
    notFound();
  }

  const company = (await getCompanyById(job.companyId)) as Company;
  const resumeList = user?.email
    ? ((await getResumeListByUserEmail(user.email)) as Resume[])
    : [];

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-b from-blue-50 via-white to-teal-50">
      <Info
        isLogin={!!user}
        jobData={job}
        company={company}
        resumeList={resumeList}
      />

      <div className="w-full max-w-6xl mx-auto my-4 md:my-6 px-4">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          <div className="w-full flex flex-col gap-4 md:gap-6">
            <Content
              data={job}
              className="w-full bg-white rounded-2xl ring-1 ring-slate-200 shadow-md"
            />
          </div>

          {/* <div className="w-full lg:w-1/4">
            <Other<Job>
              title="適合你的其他職缺"
              data={[
                testRecommendedJobData,
                testRecommendedJobData,
                testRecommendedJobData,
              ]}
              contentKey={{ title: "title", content0: "company" }}
              className="h-full"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
}
