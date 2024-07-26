import Image from "next/image";
import { BiMap } from "react-icons/bi";
import { BiBuildings } from "react-icons/bi";

type Props = {
  name: string;
  location: string;
  category: string;
  tags: string[];
  logo: string;
};

export default function Company(props: Props) {
  return (
    <div className=" border bg-white rounded-xl w-[calc(50%-1rem)] max-w-[90dvw]">
      <div className="flex gap-4 items-center px-6 pt-4">
        <div
          className="w-20 h-20 rounded-md border p-1"
          style={{
            backgroundImage: `url(${props.logo})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        ></div>
        <h2 className="text-xl text-mingdao-blue-dark font-bold">
          {props.name}
        </h2>
      </div>
      <div className="py-4 px-6 ">
        <div className="flex gap-2 items-center">
          <BiMap color="gray" size={"1.25em"}></BiMap>
          <span>{props.location}</span>
        </div>
        <div className="flex gap-2 items-center">
          <BiBuildings color="gray" size={"1.25em"}></BiBuildings>
          <span>{props.category}</span>
        </div>
        <div className="flex gap-2 py-2 flex-wrap">
          {props.tags.map((tag) => {
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
