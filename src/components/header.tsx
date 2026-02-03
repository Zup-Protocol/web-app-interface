"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useConnection } from "wagmi";
import { Web3Provider } from "../providers/web3-provider";
import { BrandLogo } from "./brand-logo";
import { ConnectWalletButton } from "./ui/buttons/connect-wallet-button";
import { ConnectedWalletButton } from "./ui/buttons/connected-wallet-button";
import { SettingsButton } from "./ui/buttons/settings-button";
import { TabButton } from "./ui/buttons/tab-button";
import { type PlusIconHandle, PlusIcon } from "./ui/icons/plus";

const itemVariants = {
  hidden: { opacity: 0, x: -10, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 200, damping: 30 },
  },
};

const groupVariants = {
  visible: { transition: { staggerChildren: 0.2 } },
};

function HeaderContent() {
  const plusRef = useRef<PlusIconHandle>(null);
  const { isConnected } = useConnection();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/0 backdrop-blur-md">
      <motion.div
        className="w-full px-[20px] py-[15px] flex items-center justify-between"
        initial="hidden"
        animate="visible"
        variants={groupVariants}
      >
        <div className="flex items-center gap-8">
          <motion.div variants={itemVariants}>
            <BrandLogo />
          </motion.div>

          <motion.div variants={itemVariants}>
            <TabButton
              className="group hidden sm:flex"
              onMouseEnter={() => plusRef.current?.startAnimation()}
              onMouseLeave={() => plusRef.current?.stopAnimation()}
              isActive={true}
            >
              <PlusIcon ref={plusRef} size={18} />
              <span>New Position</span>
            </TabButton>
          </motion.div>
        </div>

        <div className="flex items-center gap-3">
          <motion.div variants={itemVariants}>
            {isConnected ? <ConnectedWalletButton /> : <ConnectWalletButton />}
          </motion.div>
          <motion.div variants={itemVariants}>
            <SettingsButton />
          </motion.div>
        </div>
      </motion.div>
    </header>
  );
}

export function Header() {
  return (
    <Web3Provider>
      <HeaderContent />
    </Web3Provider>
  );
}
