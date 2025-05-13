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
    <div
      className={`border bg-white rounded-lg p-4 sm:p-6 md:p-6 shadow-sm border-1 border-black border-opacity-10 ${className}`}
    >
      <h1 className="text-xl sm:text-2xl text-mingdao-blue-dark font-bold mb-4 text-center">
        {title}
      </h1>
      <div className="flex flex-col gap-3">
        {recommendedThings.map((recommendedThing, index) => (
          <div
            className="p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-gray-200 mb-2 "
            key={index}
          >
            <h2 className="font-medium text-sm sm:text-base line-clamp-2 text-mingdao-blue-dark">
              {recommendedThing.title}
            </h2>
            <p className="font-normal text-xs sm:text-sm text-gray-600 mt-1">
              {recommendedThing.content0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
