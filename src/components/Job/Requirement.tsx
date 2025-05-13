type Props = {
  data: {
    experience: string;
    education: string;
    major: string;
    language: string;
    skill: string;
    ability: string;
    other: string;
  };
  className?: string;
};

type Detail = {
  [key: string]: {
    textbox?: boolean;
    title: string;
    content: string;
  };
};

export default function Requirement(props: Props) {
  const detail: Detail = {
    experience: {
      title: "工作經歷",
      content: props.data.experience,
    },
    education: {
      title: "學歷要求",
      content: props.data.education,
    },
    major: {
      title: "科系要求",
      content: props.data.major,
    },
    language: {
      title: "語文條件",
      content: props.data.language,
    },
    skill: {
      title: "擅長工具",
      content: props.data.skill,
    },
    ability: {
      title: "工作技能",
      content: props.data.ability,
    },
    other: {
      textbox: true,
      title: "其他條件",
      content: props.data.other,
    },
  };

  return (
    <div
      className={`border bg-white rounded-lg p-4 sm:p-6 md:p-8 shadow-sm ${props.className}`}
    >
      <h1 className="text-xl sm:text-2xl text-mingdao-blue-dark font-bold mb-4">
        條件要求
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {Object.keys(detail).map((key, index) => {
          // 特別處理需要整行顯示的文字框類型
          if (detail[key].textbox) {
            return (
              <div
                className="col-span-1 sm:col-span-2 py-2 border-b border-gray-100"
                key={index}
              >
                <h2 className="text-sm sm:text-base font-bold mb-2">
                  {detail[key].title}
                </h2>
                <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">
                  {detail[key].content === "" || !detail[key].content
                    ? "-"
                    : detail[key].content}
                </p>
              </div>
            );
          }

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
