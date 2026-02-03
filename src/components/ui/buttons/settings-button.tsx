import { CogIcon, type CogIconHandle } from "@/components/ui/icons/cog";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { IconButton } from "./icon-button";

interface SettingsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function SettingsButton({ className, ...props }: SettingsButtonProps) {
  const cogRef = useRef<CogIconHandle>(null);

  return (
    <IconButton
      className={cn("group h-[50px] w-[50px] border-border/10", className)}
      variant={"tertiary"}
      onMouseEnter={() => cogRef.current?.startAnimation()}
      onMouseLeave={() => cogRef.current?.stopAnimation()}
      {...props}
    >
      <CogIcon ref={cogRef} size={20} />
      <span className="sr-only">Settings</span>
    </IconButton>
  );
}
