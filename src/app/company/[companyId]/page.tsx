import { Content } from "@/components/Company/Content";
import Info from "@/components/Company/Info";
// import Job from "@/components/Global/Object/Job";
import Other from "@/components/Global/Object/Other";
import type { Company } from "@/prisma/client";
import { getCompanyById } from "./_company/actions/getCompany";
import { redirect } from "next/navigation";

export default async function companyID({
  params,
}: {
  params: { companyId: string };
}) {
  const companyData = (await getCompanyById(params.companyId)) as Company;

  if (!companyData) {
    redirect("/");
  }

  return (
    <div className="min-h-[calc(100vh-6rem)]">
      <Info data={companyData} />
      <div className="w-[98%] sm:w-[95%] max-w-5xl mx-auto my-3 md:my-4">
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
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

        <div className="flex flex-col gap-2 sm:gap-3">
          <h2 className="text-xl font-bold text-mingdao-blue-dark mb-1 md:mb-2">
            公司職缺列表
          </h2>
        </div>
      </div>
    </div>
  );
}
