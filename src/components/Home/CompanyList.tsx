// Icon
import { BiBuildings } from "react-icons/bi";

// Components
import Company from "../Global/Company";

export default function CompanyList() {
  return (
    <div className="px-6 py-4 shadow-lg bg-white rounded-xl w-[90dvw] my-12 mx-auto relative -top-28">
      <h1 className="text-xl flex gap-2 items-center text-black font-bold">
        <BiBuildings
          color="#00A3FF"
          size={"1.25em"}
          style={{ position: "relative", top: "-1px" }}
        ></BiBuildings>{" "}
        推薦公司
      </h1>
      <div className="flex flex-wrap gap-4 py-4">
        {/* <Company {...testCompanyData}></Company> */}
      </div>
    </div>
  );
}
