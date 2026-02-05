"use client";

import { ScaleClickAnimation } from "@/components/ui/animations/scale-click-animation";
import {
  CursorClickIcon,
  type CursorClickIconHandle,
} from "@/components/ui/icons/cursor-click";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import * as React from "react";

interface TokenSelectorButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

export function TokenSelectorButton({
  label,
  onClick,
  className,
}: TokenSelectorButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const iconRef = React.useRef<CursorClickIconHandle>(null);

  return (
    <ScaleClickAnimation asChild scale={0.95}>
      <motion.button
        type="button"
        onClick={onClick}
        onHoverStart={() => {
          setIsHovered(true);
          iconRef.current?.startAnimation();
        }}
        onHoverEnd={() => {
          setIsHovered(false);
          iconRef.current?.stopAnimation();
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
        className={cn(
          "flex w-full items-center justify-between",
          "h-[100px]",
          "rounded-xl px-[24px] py-4",
          "bg-secondary-button-background hover:bg-secondary-button-background-hover",
          "text-primary font-medium",
          "transition-colors duration-200",
          "cursor-pointer",
          className,
        )}
      >
        <span className="flex items-center gap-3">
          <CursorClickIcon ref={iconRef} size={20} />
          <span>{label}</span>
        </span>
        <motion.div
          animate={{ rotate: isHovered ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex items-center justify-center opacity-60"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.button>
    </ScaleClickAnimation>
  );
}
