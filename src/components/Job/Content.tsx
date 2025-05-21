import { Job, Location, EmploymentType } from "@/prisma/client";

type Detail = {
  [key: string]: {
    title: string;
    content: string;
  };
};

const location = {
  [Location.ONSITE]: "現場上班",
  [Location.REMOTE]: "遠端上班",
};

const employmentType = {
  [EmploymentType.FULL_TIME]: "全職",
  [EmploymentType.PART_TIME]: "兼職",
  [EmploymentType.CONTRACT]: "合約",
  [EmploymentType.INTERNSHIP]: "實習",
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('zh-TW').format(num);
};

export default function Content(props: { data: Job; className?: string }) {
  const detail: Detail = {
    salary: {
      title: "工作待遇",
      content: `${formatNumber(props.data.salaryMin)} ~ ${formatNumber(props.data.salaryMax)} 元`,
    },
    nature: {
      title: "工作性質",
      content: employmentType[props.data.employmentType as EmploymentType] || "暫不提供",
    },
    location: {
      title: "工作模式",
      content: location[props.data.location as Location] || "暫不提供",
    },
    address: {
      title: "工作地點",
      content: props.data.address || "暫不提供",
    },
    responsibility: {
      title: "管理責任",
      content: props.data.management || "無",
    },
    commute: {
      title: "出差外派",
      content: props.data.businessTrip || "無",
    },
    workTime: {
      title: "上班時段",
      content: props.data.workingHours || "暫不提供",
    },
    workday: {
      title: "可上班日",
      content: props.data.startDate || "暫不提供",
    },
    peopleRequired: {
      title: "需求人數",
      content: props.data.numberOfPositions?.toString() || "暫不提供",
    },
  };

  return (
    <div
      className={`border bg-white rounded-lg p-4 sm:p-6 md:p-8 shadow-sm ${props.className}`}
    >
      <h1 className="text-xl sm:text-2xl text-mingdao-blue-dark font-bold mb-4">
        工作內容
      </h1>
      <p className="mb-5 whitespace-pre-wrap text-sm sm:text-base">
        {props.data.description}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {Object.keys(detail).map((key, index) => {
          return (
            <div
              className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-2 border-b border-gray-100"
              key={index}
            >
              <h2 className="text-sm sm:text-base font-bold w-full sm:w-24 flex-shrink-0">
                {detail[key].title}
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                {detail[key].content === "" || !detail[key].content
                  ? "-"
                  : detail[key].content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
