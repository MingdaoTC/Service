import { BiMap } from "react-icons/bi";
import { BiBuildings } from "react-icons/bi";
import { Company as TCompany } from "@/types/Company";

type Props = {
  data: TCompany;
  className?: string;
};

export default function Company(props: Props) {
  return (
    <div className={`border bg-white rounded-lg ${props.className}`}>
      <div className="flex gap-2 items-center px-3 pt-3">
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-md border p-1"
          style={{
            backgroundImage: `url(${props.data.logo})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        ></div>
        <h2 className="text-base text-mingdao-blue-dark font-bold line-clamp-2">
          {props.data.name}
        </h2>
      </div>
      <div className="py-2 px-3">
        <div className="flex gap-1 items-center text-xs sm:text-sm">
          <BiMap color="gray" size={"1em"}></BiMap>
          <span className="truncate">{props.data.location}</span>
        </div>
        <div className="flex gap-1 items-center text-xs sm:text-sm">
          <BiBuildings color="gray" size={"1em"}></BiBuildings>
          <span className="truncate">{props.data.category}</span>
        </div>
        <div className="flex gap-1 py-1 flex-wrap">
          {props.data.tags.map((tag) => {
            return (
              <span
                className="border px-1.5 py-[1px] rounded-md text-xs text-gray-500"
                key={tag}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>
      <div className="w-full text-center text-white bg-mingdao-blue-dark rounded-b-lg py-2 text-sm cursor-pointer">
        查看更多工作機會 (43)
      </div>
    </div>
  );
}