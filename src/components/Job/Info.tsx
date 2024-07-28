import Button from "../Global/Button";
import { AiOutlineMail } from "react-icons/ai";
import { BiBookmark } from "react-icons/bi";

type Props = {
  data: {
    title: string;
    company: string;
    location: string;
    seniority: string;
    education: string;
    salary: string;
  };
  className?: string;
};

export default function Info(props: Props) {
  return (
    <div
      className={`w-full shadow-lg py-10 px-12 flex justify-between ${props.className}`}
    >
      <div className="w-fit">
        <h1 className="text-4xl text-mingdao-blue-dark font-extrabold">
          {props.data.title}
        </h1>
        <div className="flex gap-6 pt-4">
          <p className="text-mingdao-blue text-lg">{props.data.company}</p>
          <a
            href="#"
            className="text-mingdao-blue text-lg animated-underline-center after:bg-mingdao-blue"
          >
            本公司其他工作
          </a>
        </div>
      </div>
      <div className="flex h-fit gap-6">
        <Button
          type="secondary"
          className="flex items-center gap-2 text-[1.3rem]"
        >
          <BiBookmark className="translate-y-[1px]" />
          儲存
        </Button>
        <Button className="flex items-center gap-2 text-[1.3rem]">
          <AiOutlineMail className="translate-y-[0.5px]" />
          應徵
        </Button>
      </div>
    </div>
  );
}
