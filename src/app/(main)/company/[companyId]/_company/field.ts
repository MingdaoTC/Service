import { Company } from "@/prisma/client";

type CompanyDetailItem = {
  title: string;
  content: string;
  link?: string;
};

export function getCompanyDetailItems(data: Company): CompanyDetailItem[] {
  return [
    {
      title: "公司名稱",
      content: data.name,
    },
    {
      title: "公司地址",
      content: data.address || "暫不提供",
    },
    {
      title: "公司電話",
      content: data.phone || "暫不提供",
    },
    {
      title: "公司網站",
      content: data.website || "暫不提供",
      link: data.website || "",
    },
    {
      title: "資本額",
      content: data.capital?.toString() || "暫不提供",
    },
    {
      title: "員工人數",
      content: data.numberOfEmployees?.toString() || "暫不提供",
    },
  ];
}
