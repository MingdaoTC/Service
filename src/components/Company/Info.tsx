import { joinClass } from "@/library/joinClass";
// import { getDownloadPresignedUrl } from "@/library/storageUrlCache/presign";
import type { Company } from "@/prisma/client";

export default async function Info({
  data,
  className,
}: {
  data: Company;
  className?: string;
}) {
  return (
    <div
      className={joinClass(
        "w-full bg-white shadow-md border-b py-4 sm:py-6 mb-3 sm:mb-5",
        className,
      )}
    >
      <div className="w-[90%] sm:w-[95%] max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4">
          {data.logoUrl && (
            <div className="min-w-12 min-h-12 sm:min-w-14 sm:min-h-14 w-12 h-12 sm:w-14 sm:h-14 rounded-md border p-1 flex-shrink-0 aspect-square overflow-hidden">
              <div
                className="w-full h-full bg-contain bg-no-repeat bg-center"
                style={{
                  backgroundImage: `url(${data.logoUrl})`,
                  // backgroundImage: `url(${await getDownloadPresignedUrl(
                  //   data.logoUrl,
                  // )})`,
                }}
              />
            </div>
          )}
          <h1 className="text-xl sm:text-2xl md:text-3xl text-mingdao-blue-dark font-bold line-clamp-2 sm:line-clamp-none">
            {data.name}
          </h1>
        </div>
        {/* <div className="flex h-fit w-full sm:w-auto justify-end">
          <Button
            type="secondary"
            className="flex items-center gap-1 sm:gap-2 text-sm md:text-base px-3 py-2 sm:px-4"
          >
            <BiBookmark className="translate-y-[1px]" />
            儲存
          </Button>
        </div> */}
      </div>
    </div>
  );
}
