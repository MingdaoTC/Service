import React from "react";

// components
import Result from "@/components/Search/Results";
// import SearchBox from "@/components/Global/SearchBox";
import SimpleSearch from "@/components/Global/SimpleSearch";

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
