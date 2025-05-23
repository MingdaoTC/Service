import { getCompanyDetailItems } from "@/app/(main)/company/[companyId]/_company/field";
import { Separator } from "@/components/Global/Separator/Separator";
import { joinClass } from "@/library/joinClass";
import type { Company } from "@/prisma/client";

export function Content({
  data,
  className,
}: {
  data: Company;
  className?: string;
}) {
  const detailList = getCompanyDetailItems(data);
  return (
    <div
      className={joinClass(
        "border bg-white rounded-lg p-4 sm:p-6 md:p-8 shadow-sm",
        className,
      )}
    >
      <h1 className="text-xl sm:text-2xl text-mingdao-blue-dark font-bold mb-4">
        公司介紹
      </h1>

      <div>
        <table className="w-full border-separate border-spacing-y-1">
          <tbody>
            {detailList.map((item, index) => (
              <tr className="[&>td]:pb-3" key={index}>
                <td className="text-base font-bold w-24">{item.title}</td>
                <td className="text-base text-gray-700">{item.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Separator className="mt-3 mb-4 sm:mb-6" />

      <div className="text-sm sm:text-base font-light whitespace-pre-wrap text-gray-700">
        {data.description || "暫無公司介紹"}
      </div>
    </div>
  );
}
