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
      <div className="block md:hidden">
        {/* 手機版垂直排列 */}
        <div className="space-y-3">
          {/* {Object.keys(data).map((key, index) => (
            <div key={index} className="border-b border-gray-100 pb-2">
              <div className="font-bold text-sm sm:text-base">
                {data[key].title}
              </div>
              <div className="text-sm sm:text-base text-gray-700">
                {data[key].content}
              </div>
            </div>
          ))} */}

          {/* {Object.keys(detailColumn1).map((key, index) => (
            <div key={index} className="border-b border-gray-100 pb-2">
              <div className="font-bold text-sm sm:text-base">
                {detailColumn1[key].title}
              </div>
              <div className="text-sm sm:text-base text-gray-700">
                {detailColumn1[key].content}
              </div>
            </div>
          ))} */}
        </div>
      </div>

      <div className="hidden md:block">
        {/* 平板/桌面版表格排列 */}
        <table className="w-full border-separate border-spacing-x-4 border-spacing-y-1">
          <tbody>
            {/* {Object.keys(data).map((key, index) => {
              const column0 = data[key];
              const column1Key = Object.keys(detailColumn1)[index];
              const column1 = column1Key ? detailColumn1[column1Key] : null;
              return (
                <tr className="[&>td]:pb-3" key={index}>
                  <td className="text-base font-bold w-24">{column0.title}</td>
                  <td className="text-base text-gray-700">{column0.content}</td>

                  {column1 && (
                    <>
                      <td className="text-base font-bold w-24">
                        {column1.title}
                      </td>
                      <td className="text-base text-gray-700">
                        {column1.content}
                      </td>
                    </>
                  )}
                </tr>
              );
            })} */}
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