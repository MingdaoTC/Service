import { Content } from "@/components/Company/Content";
import Info from "@/components/Company/Info";
import Job from "@/components/Company/Job";
// import Other from "@/components/Global/Object/Other";
import type { Company, Job as TJob } from "@/prisma/client";
import { notFound } from "next/navigation";
import { getCompanyById } from "./_company/actions/getCompany";

export default async function companyID({
  params,
}: {
  params: { companyId: string };
}) {
  if (!params.companyId) {
    notFound();
  }

  const companyData: Company & { jobs: TJob[] } = (await getCompanyById(
    params.companyId,
  )) as Company & { jobs: TJob[] };

  if (!companyData) {
    notFound();
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-b from-blue-50 via-white to-teal-50">
      <Info data={companyData} />

      <div className="w-full max-w-6xl mx-auto my-4 md:my-6 px-4">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 mb-6">
          <div className="w-full">
            <Content data={companyData} className="w-full" />
          </div>
          {/* <div className="w-full lg:w-1/4">
            <Other<Company>
              title="適合你的其他公司"
              data={[companyData, companyData, companyData]}
              contentKey={{ title: "name", content0: "address" }}
              className="h-full"
            />
          </div> */}
        </div>

        <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-4 sm:p-6 md:p-8 shadow-md">
          <div className="flex flex-col gap-2 sm:gap-3">
            <h2 className="text-xl sm:text-2xl text-mingdao-blue-dark font-bold mb-4">
              公司職缺列表
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {companyData.jobs?.length > 0 ? (
              companyData.jobs.map((job) => (
                <div key={job.id} className="w-full">
                  <Job data={job} company={companyData} />
                </div>
              ))
            ) : (
              <div className="text-slate-500">暫無職缺</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
