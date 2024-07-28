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
    <div className={`border bg-white rounded-xl p-8 ${props.className}`}>
      <h1 className="text-2xl text-mingdao-blue-dark font-extrabold mb-5">
        工作內容
      </h1>
      <p className="mx-2 whitespace-pre-wrap">{props.data.description}</p>
      {Object.keys(detail).map((key) => {
        return (
          <div className="flex gap-4 my-3" key={key}>
            <h2 className="text-lg font-bold">{detail[key].title}</h2>
            <p className="text-lg font-light">
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
