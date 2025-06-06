import Footer from "@/components/Global/Footer";
import HeaderBar from "@/components/Global/Header/HeaderBar";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <HeaderBar />
      <div className="flex flex-col items-center justify-center text-center p-4 h-[calc(100dvh-15rem)]">
        <h2 className="text-2xl font-bold mb-4">頁面未找到</h2>
        <p className="mb-6">您沒有權限訪問此頁面或此頁面不存在</p>
        <Link
          href="/"
          className="px-4 py-2 bg-mingdao-blue text-white rounded-md transition"
        >
          返回首頁
        </Link>
      </div>
      <Footer />
    </>
  );
}
