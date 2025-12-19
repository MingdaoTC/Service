"use client";

import { CompanyCategory, Company as TCompany } from "@/prisma/client";
import { FaBuilding } from "react-icons/fa";
import Company from "../Global/Object/Company";

type Props = {
  data: (TCompany & { category: CompanyCategory | null })[];
  className?: string;
};

export default function CompanyList(props: Props) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md ring-1 ring-slate-200 p-4 md:p-6 ${props.className}`}
    >
      <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center mb-4">
        <FaBuilding className="mr-2 text-blue-600" /> 推薦企業
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {props.data.map((companyData, index) => (
          <Company key={index} data={companyData} />
        ))}
      </div>
    </div>
  );
}
