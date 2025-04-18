// Icon
import { BiBuildings } from "react-icons/bi";

// Components
import { Company as TCompany } from "@/types/Company";
import Company from "../Global/Company";

type Props = {
  data: TCompany[];
  className?: string;
};

export default function CompanyList(props: Props) {
  return (
    <div
      className={`border p-4 md:p-8 shadow-lg bg-white rounded-xl ${props.className}`}
    >
      <h1 className="text-xl mb-3 md:mb-5 flex gap-2 items-center text-black font-bold">
        <BiBuildings
          color="#00A3FF"
          size={"1.25em"}
          className="translate-y-[0.05em]"
        />
        推薦公司
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {props.data.map((companyData, index) => (
          <Company key={index} data={companyData} />
        ))}
      </div>
    </div>
  );
}