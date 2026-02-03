import { motion } from "framer-motion";
import { useRef } from "react";
import { BrandLogo } from "./brand-logo";
import { ConnectWalletButton } from "./ui/buttons/connect-wallet-button";
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
  visible: { transition: { staggerChildren: 0.3 } },
};

export function Header() {
  const plusRef = useRef<PlusIconHandle>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/0 backdrop-blur-md">
      <motion.div
        className="w-full px-[20px] py-[15px] flex items-center justify-between"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      >
        <motion.div
          className="flex items-center gap-8"
          variants={groupVariants}
        >
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
        </motion.div>

        <motion.div
          className="flex items-center gap-3"
          variants={groupVariants}
        >
          <motion.div variants={itemVariants}>
            <ConnectWalletButton />
          </motion.div>
          <motion.div variants={itemVariants}>
            <SettingsButton />
          </motion.div>
        </motion.div>
      </motion.div>
    </header>
  );
}
