"use client";

import { cn } from "@/lib/utils";
import { useAppKit } from "@reown/appkit/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Avatar, { genConfig } from "react-nice-avatar";
import { useConnection, useEnsName } from "wagmi";
import { CheckIcon } from "../icons/check";
import { PrimaryButton } from "./primary-button";

interface ConnectedWalletButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const transition = { type: "spring", stiffness: 500, damping: 30 } as const;

export function ConnectedWalletButton({
  className,
  ...props
}: ConnectedWalletButtonProps) {
  const { address } = useConnection();
  const { data: ensName } = useEnsName({ address });
  const { open } = useAppKit();
  const [phase, setPhase] = useState<"success" | "normal">("normal");

  useEffect(() => {
    if (address) {
      setPhase("success");
      const timer = setTimeout(() => setPhase("normal"), 2000);
      return () => clearTimeout(timer);
    }
  }, [address]);

  const formattedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const config = genConfig(address || "");
  const isSuccess = phase === "success";

  return (
    <PrimaryButton
      className={cn(
        "group transition-all duration-500 overflow-hidden px-3",
        isSuccess
          ? "bg-[#10B981] hover:bg-[#059669] text-white border-transparent"
          : "border-outline-button-border",
        className,
      )}
      onClick={() => open({ view: "Account" })}
      variant={isSuccess ? "default" : "outline"}
      icon={null}
      {...props}
    >
      <div className="relative flex items-center justify-center">
        {}
        <div className="flex items-center gap-2 invisible pointer-events-none select-none h-0 opacity-0">
          <div className="w-7 h-7" />
          <span className="whitespace-nowrap font-medium hidden sm:inline">
            Wallet Connected
          </span>
        </div>

        <AnimatePresence mode="popLayout" initial={false}>
          {isSuccess ? (
            <motion.div
              key="success-content"
              initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(8px)" }}
              transition={transition}
              className="flex items-center gap-2 whitespace-nowrap absolute"
            >
              <div className="flex items-center justify-center w-7 h-7">
                <CheckIcon size={22} autoplay delay={500} />
              </div>
              <span className="text-inherit font-medium hidden sm:inline">
                Wallet Connected
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="normal-content"
              initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(8px)" }}
              transition={transition}
              className="flex items-center gap-2 whitespace-nowrap absolute"
            >
              <div className="flex items-center justify-center w-7 h-7 overflow-hidden rounded-full ring-1 ring-white/10 shadow-sm">
                <Avatar className="w-full h-full translate-y-px" {...config} />
              </div>
              <span className="text-inherit font-medium hidden sm:inline">
                {ensName || formattedAddress}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PrimaryButton>
  );
}
