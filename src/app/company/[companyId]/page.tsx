import { Content } from "@/components/Company/Content";
import Info from "@/components/Company/Info";
import Job from "@/components/Global/Object/Job";
import Other from "@/components/Global/Object/Other";
import type { Company } from "@/prisma/client";


export default function companyID() {
  return (
    <>
      {/* <Info data={{ ...testCompanyData0 }} />
      <div className="w-[98%] sm:w-[95%] max-w-5xl mx-auto my-3 md:my-4">
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="w-full lg:w-3/4">
            <Content data={{ ...testCompanyData0 }} className="w-full" />
          </div>
          <div className="w-full lg:w-1/4">
            <Other<Company>
              title="適合你的其他公司"
              data={[testCompanyData1, testCompanyData1, testCompanyData1]}
              contentKey={{ title: "name", content0: "address" }}
              className="h-full"
            />
          </div>
        </div> */}
      {/* 
        <div className="flex flex-col gap-2 sm:gap-3">
          <h2 className="text-xl font-bold text-mingdao-blue-dark mb-1 md:mb-2">
            公司職缺列表
          </h2>
          {new Array(7).fill(testJobData).map((data, index) => (
            <Job key={index} data={data} size="lg" />
          ))}
        </div>
      </div> */}
    </>
  );
}
