import { createCompanyCategory } from "@/library/prisma/companyCategory/create";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const data = [
    {
      name: "金融服務",
    },
    {
      name: "資訊科技",
    },
    {
      name: "醫療健康",
    },
    {
      name: "教育培訓",
    },
    {
      name: "製造業",
    },
    {
      name: "零售業",
    },
    {
      name: "餐飲服務",
    },
    {
      name: "娛樂傳媒",
    },
  ];

  // data.forEach(async (item) => {
  //   // @ts-ignore
  //   await createCompanyCategory(item);
  // });
  return new NextResponse("Hello World");
}
