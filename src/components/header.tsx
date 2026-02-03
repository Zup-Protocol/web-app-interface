import { useRef } from "react";
import { BrandLogo } from "./brand-logo";
import { ConnectWalletButton } from "./ui/buttons/connect-wallet-button";
import { SettingsButton } from "./ui/buttons/settings-button";
import { TabButton } from "./ui/buttons/tab-button";
import { type PlusIconHandle, PlusIcon } from "./ui/icons/plus";

export function Header() {
  const plusRef = useRef<PlusIconHandle>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/0 backdrop-blur-md">
      <div className="w-full px-[20px] h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <BrandLogo />

          <TabButton
            className="group"
            onMouseEnter={() => plusRef.current?.startAnimation()}
            onMouseLeave={() => plusRef.current?.stopAnimation()}
            isActive={true}
          >
            <PlusIcon ref={plusRef} size={18} />
            <span>New Position</span>
          </TabButton>
        </div>

        <div className="flex items-center gap-3">
          {/* <NetworkSelector /> */}
          <ConnectWalletButton />
          <SettingsButton />
        </div>
      </div>
    </header>
  );
}
