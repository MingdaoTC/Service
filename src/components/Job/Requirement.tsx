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
    <div className={`border bg-white rounded-xl p-8 ${props.className}`}>
      <h1 className="text-2xl text-mingdao-blue-dark font-extrabold mb-5">
        條件要求
      </h1>
      {Object.keys(detail).map((key) => {
        return (
          <div className="flex gap-4 my-3" key={key}>
            <h2 className="text-lg font-bold">{detail[key].title}</h2>
            <p
              className={`text-lg font-light ${detail[key].textbox ? "whitespace-pre-wrap" : ""}`}
            >
              {detail[key].content === "" || !detail[key].content
                ? "-"
                : detail[key].content}
            </p>
          </div>
        );
      })}
    </div>
  );
}
