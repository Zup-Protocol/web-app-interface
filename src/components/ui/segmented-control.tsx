"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SegmentedControlProps<T extends string> {
  options: { label: React.ReactNode; value: T }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        "flex p-1 bg-tertiary-button-on-modal-background rounded-[14px] relative isolate",
        className,
      )}
    >
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative flex-1 px-3 py-1.5 text-base font-medium transition-colors duration-200 z-10 cursor-pointer",
              isActive
                ? "text-foreground"
                : "text-mutated-text hover:text-foreground/80",
            )}
          >
            {isActive && (
              <motion.div
                layoutId="segmented-control-active"
                className="absolute inset-0 bg-background rounded-[10px] shadow-sm -z-10"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
