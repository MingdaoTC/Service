"use client";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const SearchResult = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    if (!query) redirect("/");
  }, [query]);

  return (
    <>
      <div>Search Result: {query}</div>
    </>
  );
};

export default SearchResult;
