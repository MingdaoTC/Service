// import SearchBox from "@/components/Global/SearchBox";
import SimpleSearch from "@/components/Global/Search/SimpleSearch";
// components
import Result from "@/components/Search/Results";

const search = () => {
  return (
    <>
      <div className="px-4 py-12 mb-2 flex justify-center items-start sticky top-0">
        <div className="w-[50vw] max-lg:w-full max-lg:px-8 bg-transparent ">
          <SimpleSearch />
        </div>
      </div>
      <Result />
    </>
  );
};

export default search;
