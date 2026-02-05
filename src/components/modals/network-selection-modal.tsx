"use client";

import searchingIcon from "@/assets/escalerin/escalerin-searching-networks.svg";
import { useTranslation } from "@/hooks/use-translation";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { AppNetworks, AppNetworksUtils } from "@/lib/app-networks";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { CloseButton } from "../ui/buttons/close-button";
import { NetworkCard } from "../ui/cards/network-card";
import { Modal } from "../ui/modal";
import { SearchInput } from "../ui/search-input";
import { StateDisplay } from "../ui/state-display";

interface NetworkSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNetwork: AppNetworks;
  onSelectNetwork: (network: AppNetworks) => void;
}

export function NetworkSelectionModal({
  isOpen,
  onClose,
  currentNetwork,
  onSelectNetwork,
}: NetworkSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { translate } = useTranslation();

  const filteredNetworks = useMemo(() => {
    if (searchQuery.trim() === "") {
      return AppNetworksUtils.values;
    }
    const query = searchQuery.toLowerCase();
    return AppNetworksUtils.values.filter((id) =>
      AppNetworksUtils.getTranslatedNetworkName(id, translate)
        .toLowerCase()
        .includes(query),
    );
  }, [searchQuery, translate]);

  const handleSelect = (networkId: AppNetworks) => {
    onSelectNetwork(networkId);
    onClose();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1, // Wait a bit for the modal to open
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 30,
        mass: 1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  } as any;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="hidden sm:block absolute top-6 right-6 sm:top-8 sm:right-8 z-50">
        <CloseButton onClick={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden ml-0 mr-0 bg-modal/80 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="relative flex flex-col items-start pt-6 px-5 sm:items-center sm:text-center sm:pt-12 sm:pl-20 sm:pr-14 text-left gap-1.5 pb-2">
          <div className="flex items-center justify-between w-full sm:justify-center">
            <h2 className="text-[22px] sm:text-[23px] font-semibold tracking-tight text-foreground">
              {translate(AppTranslationsKeys.NETWORK_SELECTOR_MODAL_TITLE)}
            </h2>
            <div className="sm:hidden">
              <CloseButton onClick={onClose} />
            </div>
          </div>
          <p className="text-base text-[#9CA3AF] max-w-[300px] sm:max-w-md">
            {translate(AppTranslationsKeys.NETWORK_SELECTOR_MODAL_DESCRIPTION)}
          </p>
        </div>

        <div className="sticky top-0 z-30 bg-modal/80 backdrop-blur-md py-5 px-5 sm:pl-20 sm:pr-14 sm:py-7">
          <div className="w-full sm:flex sm:justify-center">
            <div className="w-full sm:max-w-sm">
              <SearchInput
                placeholder={translate(
                  AppTranslationsKeys.NETWORK_SELECTOR_MODAL_SEARCH_PLACEHOLDER,
                )}
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                onClear={() => setSearchQuery("")}
              />
            </div>
          </div>
        </div>

        <div className="pt-8 pb-12 px-5 sm:px-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px] justify-items-stretch"
          >
            <AnimatePresence mode="popLayout">
              {filteredNetworks.map((id) => (
                <motion.div
                  key={id}
                  layout="position"
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <NetworkCard
                    network={id}
                    name={AppNetworksUtils.getTranslatedNetworkName(
                      id,
                      translate,
                    )}
                    isSelected={currentNetwork === id}
                    onClick={() => handleSelect(id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredNetworks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <StateDisplay
                className="py-0"
                image={searchingIcon}
                title={translate(
                  AppTranslationsKeys.NETWORK_SELECTOR_MODAL_EMPTY_TITLE,
                )}
                description={translate(
                  AppTranslationsKeys.NETWORK_SELECTOR_MODAL_EMPTY_DESCRIPTION,
                )}
              />
            </motion.div>
          )}
        </div>
      </div>
    </Modal>
  );
}
