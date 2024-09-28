import { joinClass } from "@/modules/joinClass";
import { Company } from "@customTypes/Company";
import { Separator } from "@/components/Global/Separator";

export function Content({
  data,
  className,
}: {
  data: Company;
  className?: string;
}) {
  const detailColumn0: Detail = {
    category: {
      title: "產業類別",
      content: data.category,
    },
    description: {
      title: "產業描述",
      content: data.description,
    },
    capital: {
      title: "資本額",
      content: data.capital || "暫不提供",
    },
    employeeCount: {
      title: "員工人數",
      content: data.employeeCount || "暫不提供",
    },
    website: {
      title: "公司網址",
      content: data.website || "暫不提供",
    },
  };

  const detailColumn1: Detail = {
    contact: {
      title: "聯絡人",
      content: data.contact || "暫不提供",
    },
    phone: {
      title: "電話",
      content: data.phone || "暫不提供",
    },
    fax: {
      title: "傳真",
      content: data.fax || "暫不提供",
    },
    address: {
      title: "公司地址",
      content: data.address,
    },
  };

  return (
    <div className={joinClass("border bg-white rounded-xl p-8", className)}>
      <h1 className="text-2xl text-mingdao-blue-dark font-extrabold mb-5">
        公司介紹
      </h1>
      <table className="w-full">
        <tbody>
          {Object.keys(detailColumn0).map((key, index) => {
            const column0 = detailColumn0[key];
            const column1 = detailColumn1[Object.keys(detailColumn1)[index]];
            return (
              <tr className="[&>td]:pb-3" key={key}>
                {column0 && (
                  <>
                    <td className="text-lg font-bold">{column0.title}</td>
                    <td className="text-lg font-light">{column0.content}</td>
                  </>
                )}
                {column1 && (
                  <>
                    <td className="text-lg font-bold">{column1.title}</td>
                    <td className="text-lg font-light">{column1.content}</td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Separator className="mt-3 mb-6" />
      <p className="font-light whitespace-pre-wrap">{data.detail}</p>
    </div>
  );
}

type Detail = {
  [key: string]: {
    title: string;
    content: string;
  };
};
