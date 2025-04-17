"use client";

import { useState } from "react";

import Button from "./Button";
import { useRouter } from "next/navigation";

type TProps = {
  searchText?: string;
};

export default function SimpleSearch(props: TProps) {
  const [keyword, setKeyword] = useState(props.searchText || "");

  const router = useRouter();

  const handleSearch = () => {
    console.log(keyword);
    router.push(`/search?q=${keyword}`);
  };

  return (
    <div className="flex flex-row items-start justify-start gap-2 bg-white border border-mingdao-blue rounded-xl p-2">
      <input
        type="text"
        className=" text-gray-900 text-sm w-full p-2.5 outline-none border-r"
        placeholder="關鍵字 (例如: 軟體工程師)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
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
