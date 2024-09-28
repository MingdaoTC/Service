import { BiBookmark } from "react-icons/bi";

import { joinClass } from "@/modules/joinClass";
import Button from "../Global/Button";
import { Company } from "@customTypes/Company";

export default function Info({
  data,
  className,
}: {
  data: Company;
  className?: string;
}) {
  return (
    <div
      className={joinClass(
        "w-full h-40 shadow-lg px-12 flex justify-between items-center",
        className,
      )}
    >
      <h1 className="text-4xl text-mingdao-blue-dark font-extrabold">
        {data.name}
      </h1>
      <div className="flex h-fit gap-6">
        <Button
          type="secondary"
          className="flex items-center gap-2 text-[1.3rem]"
        >
          <BiBookmark className="translate-y-[1px]" />
          儲存
        </Button>
      </div>
    </div>
  );
}
