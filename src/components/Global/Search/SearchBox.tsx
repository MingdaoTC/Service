"use client";

import { useState } from "react";

import Button from "../Button/Button";

export default function SearchBox() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = () => { };

  return (
    <div className="flex flex-row items-start justify-start gap-2 bg-white border border-mingdao-blue rounded-xl p-2">
      <input
        type="text"
        className=" text-gray-900 text-sm w-full p-2.5 outline-none border-r"
        placeholder="關鍵字 (例如: 軟體工程師)"
      />

      <input
        type="text"
        className=" text-gray-900 text-sm w-full p-2.5 outline-none border-r"
        placeholder="地點 (例如: 台中市)"
      />

      <input
        type="text"
        className=" text-gray-900 text-sm w-full p-2.5 outline-none"
        placeholder="類別 (例如: 軟體工程師)"
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
