import {
  ConnectIcon,
  type ConnectIconHandle,
} from "@/components/ui/icons/connect";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { PrimaryButton } from "./primary-button";

interface ConnectWalletButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function ConnectWalletButton({
  className,
  ...props
}: ConnectWalletButtonProps) {
  const connectRef = useRef<ConnectIconHandle>(null);

  return (
    <PrimaryButton
      icon={<ConnectIcon ref={connectRef} size={20} />}
      className={cn("group flex items-center justify-center", className)}
      onRevealComplete={() => connectRef.current?.startAnimation()}
      onMouseLeave={() => connectRef.current?.stopAnimation()}
      onPointerDown={() => connectRef.current?.startAnimation()}
      onPointerLeave={() => connectRef.current?.stopAnimation()}
      {...props}
    >
      Connect Wallet
    </PrimaryButton>
  );
}
