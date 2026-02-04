"use client";

import searchingIcon from "@/assets/escalerin/escalerin-searching-networks.svg";
import { AppNetworks, AppNetworksUtils } from "@/lib/app-networks";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
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
  const [filteredNetworks, setFilteredNetworks] = useState(
    AppNetworksUtils.values,
  );

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredNetworks(AppNetworksUtils.values);
    } else {
      setFilteredNetworks(
        AppNetworksUtils.values.filter((id) =>
          AppNetworksUtils.networkName[id]
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        ),
      );
    }
  }, [searchQuery]);

  const handleSelect = (networkId: AppNetworks) => {
    onSelectNetwork(networkId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Close Button - Hoisted to be relative to the Modal Frame, ignoring scrollbars */}
      <div className="hidden sm:block absolute top-6 right-6 sm:top-8 sm:right-8 z-50">
        <CloseButton onClick={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden ml-0 mr-0 bg-modal [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Scrollable Intro (Title + Description) - Scrolls away */}
        <div className="relative flex flex-col items-start pt-6 px-5 sm:items-center sm:text-center sm:pt-12 sm:pl-20 sm:pr-14 text-left gap-1.5 pb-2">
          <div className="flex items-center justify-between w-full sm:justify-center">
            <h2 className="text-[22px] sm:text-[24px] font-bold tracking-tight text-foreground">
              Select Network
            </h2>
            <div className="sm:hidden">
              <CloseButton onClick={onClose} />
            </div>
          </div>
          <p className="text-[16px] text-[#9CA3AF] max-w-[300px] sm:max-w-md">
            Select your preferred network. Choose a specific chain to filter
            data, or select "All Networks" for a multi-chain overview
          </p>
        </div>

        {/* Sticky Search Bar - Sticks to top */}
        <div className="sticky top-0 z-30 bg-modal/80 backdrop-blur-md py-5 px-5 sm:pl-20 sm:pr-14 sm:py-7">
          <div className="w-full sm:flex sm:justify-center">
            <div className="w-full sm:max-w-sm">
              <SearchInput
                placeholder="Find a network"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                onClear={() => setSearchQuery("")}
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="pt-8 pb-12 px-5 sm:px-10">
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px] justify-items-stretch"
          >
            <AnimatePresence mode="popLayout">
              {filteredNetworks.map((id) => (
                <motion.div
                  key={id}
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.95 },
                    show: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                      },
                    },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                >
                  <NetworkCard
                    network={id}
                    name={AppNetworksUtils.networkName[id]}
                    isSelected={currentNetwork === id}
                    onClick={() => handleSelect(id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredNetworks.length === 0 && (
            <StateDisplay
              className="py-0"
              image={searchingIcon}
              title="No networks found"
              description="We couldn't find any network matching your search. Try adjusting your keywords."
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
