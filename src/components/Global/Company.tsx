import { Company as TCompany } from "@customTypes/Company";
import Image from "next/image";
import { BiMap } from "react-icons/bi";
import { BiBuildings } from "react-icons/bi";

type Props = {
  data: TCompany;
  className?: string;
};

export default function Company(props: Props) {
  return (
    <div className={`border bg-white rounded-xl ${props.className}`}>
      <div className="flex gap-4 items-center px-6 pt-4">
        <div
          className="w-20 h-20 rounded-md border p-1"
          style={{
            backgroundImage: `url(${props.data.logo})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        ></div>
        <h2 className="text-xl text-mingdao-blue-dark font-bold">
          {props.data.name}
        </h2>
      </div>
      <div className="py-4 px-6">
        <div className="flex gap-2 items-center">
          <BiMap color="gray" size={"1.25em"}></BiMap>
          <span>{props.data.location}</span>
        </div>
        <div className="flex gap-2 items-center">
          <BiBuildings color="gray" size={"1.25em"}></BiBuildings>
          <span>{props.data.category}</span>
        </div>
        <div className="flex gap-2 py-2 flex-wrap">
          {props.data.tags.map((tag) => {
            return (
              <span
                className="border px-2     py-[2px] rounded-lg text-sm text-gray-500"
                key={tag}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>
      <div className="w-full text-center text-white bg-mingdao-blue-dark rounded-b-xl py-3 cursor-pointer">
        查看更多工作機會 (43)
      </div>
    </div>
  );
}
