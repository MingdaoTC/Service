import Footer from "@/components/Global/Footer";
import HeaderBar from "@/components/Global/Header/HeaderBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderBar />
      <div className="h-[calc(100dvh-3rem)] flex flex-col overflow-auto">
        <div className="flex-none min-h-[calc(100dvh-15rem)]">
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
}