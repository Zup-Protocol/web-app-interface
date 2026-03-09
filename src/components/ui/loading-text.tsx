import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

interface LoadingTextProps {
  text?: string;
  className?: string;
}

export function LoadingText({ text = "Loading", className }: LoadingTextProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Loader2Icon className="w-[18px] h-[18px] animate-spin text-mutated-text" />
      <span className="font-medium text-base bg-[linear-gradient(110deg,#b6bcc5,45%,#f3f4f6,55%,#b6bcc5)] dark:bg-[linear-gradient(110deg,#52525b,45%,#ffffff,55%,#52525b)] bg-size-[200%_100%] animate-shimmer bg-clip-text text-transparent">
        {text}
      </span>
    </div>
  );
}
