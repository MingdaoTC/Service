type Props = {
  data: {
    description: string;
    category: string;
    salary: string;
    nature: string;
    location: string;
    responsibility: string;
    commute: string;
    workTime: string;
    holiday: string;
    workday: string;
    peopleRequired: string;
  };
  className?: string;
};

type Detail = {
  [key: string]: {
    title: string;
    content: string;
  };
};

export default function Content(props: Props) {
  const detail: Detail = {
    category: {
      title: "職務類別",
      content: props.data.category,
    },
    salary: {
      title: "工作待遇",
      content: props.data.salary,
    },
    nature: {
      title: "工作性質",
      content: props.data.nature,
    },
    location: {
      title: "上班地點",
      content: props.data.location,
    },
    responsibility: {
      title: "管理責任",
      content: props.data.responsibility,
    },
    commute: {
      title: "出差外派",
      content: props.data.commute,
    },
    workTime: {
      title: "上班時段",
      content: props.data.workTime,
    },
    holiday: {
      title: "休假制度",
      content: props.data.holiday,
    },
    workday: {
      title: "可上班日",
      content: props.data.workday,
    },
    peopleRequired: {
      title: "需求人數",
      content: props.data.peopleRequired,
    },
  };

  return (
    <div
      className={`border bg-white rounded-lg p-4 sm:p-6 md:p-8 shadow-sm ${props.className}`}
    >
      <h1 className="text-xl sm:text-2xl text-mingdao-blue-dark font-bold mb-4">
        工作內容
      </h1>
      <p className="mx-1 sm:mx-2 mb-5 whitespace-pre-wrap text-sm sm:text-base">
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
