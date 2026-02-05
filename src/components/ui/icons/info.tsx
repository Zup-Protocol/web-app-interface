"use client";

import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface InfoIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface InfoIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const InfoIcon = forwardRef<InfoIconHandle, InfoIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          controls.start("animate");
        }
      },
      [controls, onMouseEnter],
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else {
          controls.start("normal");
        }
      },
      [controls, onMouseLeave],
    );

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.circle
            animate={controls}
            cx="12"
            cy="12"
            r="10"
            variants={{
              normal: { scale: 1 },
              animate: { scale: [1, 1.1, 1] },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          <motion.path
            animate={controls}
            d="M12 16v-4"
            variants={{
              normal: { y: 0 },
              animate: { y: [0, -1, 0] },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          <motion.path
            animate={controls}
            d="M12 8h.01"
            variants={{
              normal: { scale: 1 },
              animate: { scale: [1, 1.3, 1] },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        </svg>
      </div>
    );
  },
);

InfoIcon.displayName = "InfoIcon";

export { InfoIcon };
