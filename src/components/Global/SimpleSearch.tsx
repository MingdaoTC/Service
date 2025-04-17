"use client";

import { useEffect, useState } from "react";

import Button from "./Button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type TProps = {
  searchText?: string;
};

export default function SimpleSearch(props: TProps) {
  const [keyword, setKeyword] = useState(props.searchText || "");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = () => {
    router.push(`/search?q=${keyword}`);
  };

  // updating textbox with query will only run when pathname is "/search"
  useEffect(() => {
    if (pathname === "/search") {
      const query = searchParams.get("q");
      if (query) {
        setKeyword(query);
      }
    }
  }, [searchParams, pathname]);

  return (
    <div className="flex flex-row items-start justify-start gap-2 bg-white border border-mingdao-blue rounded-xl p-2">
      <input
        type="text"
        className=" text-gray-900 text-sm w-full p-2.5 outline-none border-r"
        placeholder="關鍵字 (例如: 軟體工程師)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />

      <Button
        onClick={handleSearch}
        className="whitespace-nowrap rounded-lg px-10"
      >
        搜尋
      </Button>
    </div>
  );
}
