import { Job as TJob } from "@customTypes/Job";

type Props = {
  data: TJob;
  className?: string;
  size?: "sm" | "lg";
};

export default function Job(props: Props) {
  if (props.size === "sm") {
    return (
      <div
        className={`px-6 py-4 border bg-white rounded-xl ${props.className}`}
      >
        <h2 className="text-xl text-mingdao-blue-dark font-extrabold">
          {props.data.title}
        </h2>
        <div className="py-4">
          <p className="text-mingdao-blue-dark font-bold">
            {props.data.company}
          </p>
          <div className="flex">
            <p className="text-black font-bold pr-2 after:content-['|'] after:relative after:-right-2 after:text-mingdao-blue-light">
              {props.data.location}
            </p>
            <p className="text-black font-bold px-2 after:content-['|'] after:relative after:-right-2 after:text-mingdao-blue-light">
              {props.data.seniority}
            </p>
            <p className="text-black font-bold pl-2">{props.data.education}</p>
          </div>
        </div>
        <p className="text-mingdao-blue font-semibold">
          月薪 {props.data.salary} 元
        </p>
      </div>
    );
  }
  return (
    // TODO: add large size (small size is using in Home page) 2024.09.28 Lazp
    <></>
  );
}
