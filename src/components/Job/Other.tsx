import { Job } from "@customTypes/Job";

type Props = {
  data: Job[];
  className?: string;
};

export default function Other(props: Props) {
  const recommendedJobs = props.data.map((job) => ({
    title: job.title,
    company: job.company,
  }));
  return (
    <div className={`border bg-white rounded-xl p-8 ${props.className}`}>
      <h1 className="text-2xl text-mingdao-blue-dark font-extrabold mb-5">
        適合你的其他職缺
      </h1>
      {recommendedJobs.map((job, index) => (
        <div className="my-3 w-fit cursor-pointer" key={index}>
          <h2 className="font-medium">{job.title}</h2>
          <p className="font-light">{job.company}</p>
        </div>
      ))}
    </div>
  );
}
