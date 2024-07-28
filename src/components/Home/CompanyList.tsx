// Icon
import { BiBuildings } from "react-icons/bi";

// Components
import Company from "../Global/Company";

const testCompanyData = {
  name: "英屬維京群島商太古可口可樂(股)公司台灣分公司",
  location: "桃園市桃園區",
  category: "飲料製造業",
  tags: ["其他客服人員", "國內業務", "國外業務"],
  logo: "https://cdn.lazco.dev/cocacola.png",
};

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
      <div className="flex flex-wrap gap-4 py-4 justify-between">
        {new Array(7).fill(testCompanyData).map((companyData, index) => (
          <Company key={index} {...companyData} />
        ))}
      </div>
    </div>
  );
}
