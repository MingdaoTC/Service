import { getApplicationListByCompanyUser } from "@/library/actions/getApplicationList";
import { getJobInfo } from "@/library/actions/getJobInfo";
import { getResumeListByUserEmail } from "@/library/actions/getResumeList";
import { Job, Resume } from "@/prisma/client";
import { redirect } from "next/navigation";
import ExpandableRow from "./_application/ExpandableRow";

export default async function ApplicationListPage() {
  const applications = await getApplicationListByCompanyUser();

  if (!Array.isArray(applications) && applications?.error) {
    redirect("/");
  }

  // Build a resume map: { [email: string]: Resume | undefined }
  let resumeMap: Record<string, Resume | undefined> = {};
  if (Array.isArray(applications) && applications.length > 0) {
    // Fetch resumes for all applicant emails in parallel
    const emails = applications.map((app) => app.email);
    const resumeResults = await Promise.all(
      emails.map(async (email) => {
        try {
          const resumes = await getResumeListByUserEmail(email);
          // If multiple resumes, pick the latest (by createdAt) or just the first
          return { email, resume: resumes?.[0] };
        } catch {
          return { email, resume: undefined };
        }
      }),
    );
    resumeMap = resumeResults.reduce(
      (acc, { email, resume }) => {
        acc[email] = resume;
        return acc;
      },
      {} as Record<string, Resume | undefined>,
    );
  }

  let jobMap: Record<string, Job> = {};
  if (Array.isArray(applications) && applications.length > 0) {
    const jobIds = applications.map((app) => app.jobId);
    const jobResults = await Promise.all(
      jobIds.map(async (jobId) => {
        try {
          const job = await getJobInfo(jobId);
          return { jobId, job };
        } catch {
          return { jobId, job: undefined };
        }
      }),
    );
    jobMap = jobResults.reduce(
      (acc, { jobId, job }) => {
        if (!job) {
          return acc;
        }
        acc[jobId] = job;
        return acc;
      },
      {} as Record<string, Job>,
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 bg-white shadow-sm rounded-lg border p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-blue-800">
            應徵者列表
          </h1>
          <p className="text-gray-600 mt-1">查看應徵者檔案</p>
        </div>
      </div>
      <div className="bg-white shadow-sm rounded-lg border overflow-hidden mb-8 text-center">
        <div className="p-4 bg-gray-50 border-b text-center">
          <div className="grid grid-cols-7 text-sm font-medium text-gray-600">
            <div className="col-span-2">應徵者 Email</div>
            <div className="col-span-1">姓名</div>
            <div className="col-span-1">狀態</div>
            <div className="col-span-1">應徵時間</div>
            <div className="col-span-1">職缺</div>
            <div className="col-span-1">操作</div>
          </div>
        </div>
        <div className="divide-y">
          {Array.isArray(applications) && applications.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-500">
              無應徵資料
            </div>
          )}
          {Array.isArray(applications) &&
            applications.map((app: any) => (
              <ExpandableRow
                key={app.id}
                app={app}
                resume={resumeMap[app.email] ?? null}
                job={jobMap[app.jobId] ?? null}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
