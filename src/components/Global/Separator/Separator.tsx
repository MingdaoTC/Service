import { joinClass } from "@/modules/joinClass";

export function Separator({ className }: { className?: string }) {
  return (
    <div
      className={joinClass(
        "w-full h-[1px] bg-gray-300 rounded-full",
        className,
      )}
    />
  );
}
