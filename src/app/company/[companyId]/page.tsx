// Components
import HeaderBar from "@/components/Global/HeaderBar";
import Button from "@/components/Global/Button";

// Third-Party Library
import Image from "next/image";

// Icons
import { GoBookmark } from "react-icons/go";
import Info from "@/components/Company/Info";

const testCompanyData = {
  title: "硬體研發工程師(伺服器及工作站)",
  company: "華碩電腦股份有限公司",
  location: "台北市北投區",
  seniority: "兩年以上",
  education: "大學",
  salary: "999999",
};

export default function companyID() {
  return (
    <>
      <HeaderBar />
      <Info data={testCompanyData} />
      {/* <div className="h-auto w-full flex px-[2rem] shadow-md shadow-[#D9D9D9] justify-between">
        <div className="justify-start flex">
          <Image
            src="https://cdn.lazco.dev/MDTC-ASUS.png"
            height={80}
            width={80}
            alt="ASUS"
          />
          <h1 className="my-auto pl-2 text-lg font-black text-[#00446A]">
            華碩電腦股份有限公司
          </h1>
        </div>
        <div className="my-auto justify-end">
          <Button type="secondary" className="flex gap-1">
            <div className="my-auto flex translate-y-[1px]">
              <GoBookmark />
            </div>
            儲存
          </Button>
        </div>
      </div> */}
    </>
  );
}
