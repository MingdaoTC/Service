type Props = {
  title: string;
  company: string;
  location: string;
  seniority: string;
  education: string;
  salary: string;
};

export default function Job(props: Props) {
  return (
    <div className="px-6 py-4 border bg-white rounded-xl w-[calc(50%-1rem)] max-w-[90dvw]">
      <h2 className="text-xl text-mingdao-blue-dark font-extrabold">
        {props.title}
      </h2>
      <div className="py-4">
        <p className="text-mingdao-blue-dark font-bold">{props.company}</p>
        <div className="flex">
          <p className="text-black font-bold pr-2 after:content-['|'] after:relative after:-right-2 after:text-mingdao-blue-light">
            {props.location}
          </p>
          <p className="text-black font-bold px-2 after:content-['|'] after:relative after:-right-2 after:text-mingdao-blue-light">
            {props.seniority}
          </p>
          <p className="text-black font-bold pl-2">{props.education}</p>
        </div>
      </div>
      <p className="text-mingdao-blue font-semibold">月薪 {props.salary} 元</p>
    </div>
  );
}
