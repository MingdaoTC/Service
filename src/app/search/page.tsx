import React from "react";

// components
import Result from "@/components/Search/Results";
import SearchBox from "@/components/Global/SearchBox";

const search = () => {
  return (
    <>
      <div className="px-4 py-10 flex justify-center items-start">
        <SearchBox />
      </div>
      <Result />
    </>
  );
};

export default search;
