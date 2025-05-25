import { auth } from "@/library/auth";
import { Company, Job, User, Resume } from "@/prisma/client";

// import Other from "@/components/Global/Object/Other";
// Components
import Content from "@/components/Job/Content";
import Info from "@/components/Job/Info";
import { notFound } from "next/navigation";
import { getCompanyById } from "./_job/actions/getCompany";
import { getJobById } from "./_job/actions/getJob";
import { getResumeListByUserEmail } from "@/library/actions/getResumeList";

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
  const resumeList = user.email
    ? ((await getResumeListByUserEmail(user.email)) as Resume[])
    : [];

  return (
    <div className="">
      <Info
        isLogin={!!user}
        jobData={job}
        company={company}
        resumeList={resumeList}
      />
      <div className="w-[98%] sm:w-[95%] max-w-5xl mx-auto my-3 md:my-4">
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
          <div className="w-full flex flex-col gap-3 md:gap-4">
            <Content data={job} className="w-full" />
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
