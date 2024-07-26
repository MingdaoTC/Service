// Components
import HeaderBar from "@/components/Global/HeaderBar";
import Button from "@/components/Global/Button";

// Third-Party Library
import Image from "next/image";

// Icons
import { GoBookmark } from "react-icons/go";

export default function companyID() {
  return (
    <>
      <HeaderBar />
      <div className="h-auto w-full flex px-[2rem] shadow-md shadow-[#D9D9D9] justify-between">
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
      </div>
    </>
  );
}
