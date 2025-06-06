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
        <div className="flex-none min-h-[calc(100dvh-3rem)]">{children}</div>
      </div>
    </>
  );
}
