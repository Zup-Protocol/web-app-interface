import {
  ConnectIcon,
  type ConnectIconHandle,
} from "@/components/ui/icons/connect";
import { useTranslation } from "@/hooks/use-translation";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { cn } from "@/lib/utils";
import { useAppKit } from "@reown/appkit/react";
import { useEffect, useRef, useState } from "react";
import { PrimaryButton } from "./primary-button";

interface ConnectWalletButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function ConnectWalletButton({
  className,
  ...props
}: ConnectWalletButtonProps) {
  const { translate } = useTranslation();
  const connectRef = useRef<ConnectIconHandle>(null);
  const appKit = useAppKit();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 640px)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <PrimaryButton
      icon={<ConnectIcon ref={connectRef} size={20} />}
      className={cn("group flex items-center justify-center", className)}
      onRevealComplete={() => connectRef.current?.startAnimation()}
      onMouseLeave={() => connectRef.current?.stopAnimation()}
      onPointerDown={() => connectRef.current?.startAnimation()}
      onPointerLeave={() => connectRef.current?.stopAnimation()}
      onClick={() => appKit.open({ view: "Connect" })}
      {...props}
    >
      {(!mounted || !isMobile) && (
        <span className="hidden sm:inline">
          {translate(AppTranslationsKeys.HEADER_BUTTONS_CONNECT)}
        </span>
      )}
    </PrimaryButton>
  );
}
