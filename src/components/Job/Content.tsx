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
    experience: {
      title: "工作經歷",
      content: props.data.experience || "不拘",
    },
    education: {
      title: "學歷要求",
      content: props.data.education || "不拘",
    },
    major: {
      title: "科系要求",
      content: props.data.major || "不拘",
    },
    language: {
      title: "語言能力",
      content: props.data.language || "不拘",
    },
  };
  console.log(JSON.stringify(props.data.benefits));

  return (
    <div
      className={`border bg-white rounded-lg p-4 sm:p-6 md:p-8 shadow-sm ${props.className}`}
    >
      <h1 className="text-xl sm:text-2xl text-mingdao-blue-dark font-bold mb-4">
        工作內容
      </h1>
      <div className="w-full rounded-md mt-2 mb-2 h-auto text-left">
        <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">
          {props.data.description}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-5">
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
      <div className="flex flex-col text-left mt-2">
        <h2 className="text-sm sm:text-base font-bold w-full sm:w-24 flex-shrink-0 text-left">
          專業技能
        </h2>
        <div className="w-full rounded-md mt-2 mb-2 h-auto text-left">
          <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">
            {props.data.skills || "暫不提供"}
          </p>
        </div>
      </div>
      <hr />
      <div className="flex flex-col text-left mt-2">
        <h2 className="text-sm sm:text-base font-bold w-full sm:w-24 flex-shrink-0 text-left">
          福利制度
        </h2>
        <div className="w-full rounded-md mt-2 mb-2 h-auto text-left">
          <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">
            {props.data.benefits || "暫不提供"}
          </p>
        </div>
      </div>
      <hr />
      <div className="flex flex-col text-left mt-2">
        <h2 className="text-sm sm:text-base font-bold w-full sm:w-24 flex-shrink-0 text-left">
          其他資訊
        </h2>
        <div className=" w-full rounded-md mt-2 mb-2 h-auto text-left">
          <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">
            {props.data.others || "暫不提供"}
          </p>
        </div>
      </div>
    </div>
  );
}
