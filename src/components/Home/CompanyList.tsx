import { BiBuildings } from "react-icons/bi";
import { Company as TCompany } from "@/prisma/client";
import Company from "../Global/Object/Company";

type Props = {
  data: TCompany[];
  className?: string;
};

export default function CompanyList(props: Props) {
  return (
    <div
      className={`border p-3 md:p-5 shadow-md bg-white rounded-lg ${props.className}`}
    >
      <h1 className="text-lg mb-2 md:mb-3 flex gap-1.5 items-center text-black font-bold">
        <BiBuildings
          color="#00A3FF"
          size={"1.2em"}
          className="translate-y-[0.05em]"
        />
        推薦公司
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {props.data.map((companyData, index) => (
          <Company key={index} data={companyData} />
        ))}
      </div>
    </div>
  );
}