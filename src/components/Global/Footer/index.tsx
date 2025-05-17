import Link from "next/link";

export default function Footer() {
  return (
    <div className="bg-mingdao-blue bg-opacity-75 text-white h-[4rem] flex-1 py-4 flex items-center justify-center">
      <div className="w-[98%] sm:w-[95%] max-w-5xl mx-auto text-center my-auto">
        <p>© {new Date().getFullYear()} 明道人才雲 - 打造理想職涯</p>
      </div>
    </div>
  );
}
