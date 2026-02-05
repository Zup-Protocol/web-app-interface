import { useAppNetwork } from "@/hooks/use-network";
import { useTranslation } from "@/hooks/use-translation";
import { AppNetworksUtils } from "@/lib/app-networks";
import { ThemeMode } from "@/lib/theme-mode";
import { ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { NetworkSelectionModal } from "./modals/network-selection-modal";
import { PrimaryButton } from "./ui/buttons/primary-button";

interface NetworkSelectorProps {
  className?: string;
}

export function NetworkSelector({}: NetworkSelectorProps) {
  const { network, setAppNetwork: setNetwork } = useAppNetwork();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const { translate } = useTranslation();

  const Icon = AppNetworksUtils.logoSvg[network];
  const activeIcon = resolvedTheme === ThemeMode.DARK ? Icon.dark : Icon.light;
  const iconSrc = typeof activeIcon === "string" ? activeIcon : activeIcon.src;

  return (
    <>
      <PrimaryButton
        variant="tertiary"
        onClick={() => setIsModalOpen(true)}
        icon={
          <div className="flex items-center justify-center w-6 h-6">
            {Icon && (
              <img
                src={iconSrc}
                alt="Network"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        }
        alwaysIcon
      >
        <div className="flex items-center gap-1.5">
          <span className="text-base font-semibold hidden sm:inline">
            {AppNetworksUtils.getTranslatedNetworkName(network, translate)}
          </span>
          <ChevronDown
            size={14}
            className="text-foreground group-hover:text-foreground transition-colors"
          />
        </div>
      </PrimaryButton>

      <NetworkSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentNetwork={network}
        onSelectNetwork={setNetwork}
      />
    </>
  );
}
