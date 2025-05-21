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
      className={`p-3 md:p-5 shadow-md bg-white rounded-lg ${props.className}`}
    >
      <h2 className="text-2xl font-bold text-mingdao-blue-dark flex items-center mb-4">
        <FaBuilding className="mr-2" /> 推薦企業
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {props.data.map(
          (
            companyData: TCompany & { category: CompanyCategory | null },
            index,
          ) => (
            <Company key={index} data={companyData} />
          ),
        )}
      </div>
    </div>
  );
}
