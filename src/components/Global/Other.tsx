export default function Other<DataType>({
  title,
  data,
  contentKey,
  className,
}: {
  title: string;
  data: DataType[];
  contentKey: {
    title: string;
    content0: string;
  };
  className?: string;
}) {
  const recommendedThings = data.map((thing: any) => ({
    title: thing[contentKey.title],
    content0: thing[contentKey.content0],
  }));

  return (
    <div className={`border bg-white rounded-xl p-8 ${className}`}>
      <h1 className="text-2xl text-mingdao-blue-dark font-extrabold mb-5">
        {title}
      </h1>
      {recommendedThings.map((recommendedThing, index) => (
        <div className="my-3 w-fit cursor-pointer" key={index}>
          <h2 className="font-medium">{recommendedThing.title}</h2>
          <p className="font-light">{recommendedThing.content0}</p>
        </div>
      ))}
    </div>
  );
}
