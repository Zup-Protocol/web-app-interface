"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import * as React from "react";
import { ScaleClickAnimation } from "../animations/scale-click-animation";

interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function TextButton({
  children,
  className,
  icon,
  ...props
}: TextButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const iconRef = React.useRef<any>(null);

  const handleHoverStart = (event: any) => {
    setIsHovered(true);
    iconRef.current?.startAnimation?.();
    if (typeof props.onMouseEnter === "function") {
      (props as any).onMouseEnter(event);
    }
  };

  const handleHoverEnd = (event: any) => {
    setIsHovered(false);
    iconRef.current?.stopAnimation?.();
    if (typeof props.onMouseLeave === "function") {
      (props as any).onMouseLeave(event);
    }
  };

  return (
    <ScaleClickAnimation asChild>
      <motion.button
        {...(props as any)}
        className={cn(
          "relative flex items-center gap-2 text-base font-medium transition-colors duration-200 px-1 py-0.5",
          "text-primary",
          "cursor-pointer outline-none",
          className,
        )}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
      >
        {icon &&
          React.isValidElement(icon) &&
          React.cloneElement(
            icon as React.ReactElement,
            {
              ref: iconRef,
              size: 16,
            } as any,
          )}
        {children}
        <motion.div
          className="absolute bottom-[-5px] left-0 h-[1.5px] w-full bg-primary"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ originX: 0.5 }}
        />
      </motion.button>
    </ScaleClickAnimation>
  );
}
