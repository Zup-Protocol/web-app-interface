"use client";

import { IconButton } from "@/components/ui/buttons/icon-button";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import * as React from "react";

export function AssetTooltipContent({
  title,
  description,
  onClose,
  children,
  containerRef,
}: {
  title: string;
  description?: string;
  onClose?: () => void;
  children: React.ReactNode;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex flex-col min-w-[240px] relative min-h-0">
      {onClose && (
        <div className="absolute top-5 right-5 z-40">
          <IconButton
            variant="tertiaryOnModal"
            size="default"
            onClick={onClose}
            className="rounded-lg h-8 w-8 [&_svg]:size-4 shrink-0 shadow-none hover:bg-foreground/5 transition-colors"
          >
            <X className="text-mutated-text" />
          </IconButton>
        </div>
      )}

      <motion.div
        ref={containerRef}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05,
              delayChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="visible"
        className="flex flex-col overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative"
      >
        <div className="md:relative sticky top-0 z-30 md:z-auto md:bg-transparent bg-modal/60 backdrop-blur-md md:backdrop-blur-none px-5 pt-5 pb-3">
          <h4 className="font-semibold text-foreground text-base pr-8 leading-none">
            {title}
          </h4>
          {description && (
            <p className="text-base text-mutated-text mt-2 pr-8 leading-tight">
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1 px-5 mt-3">{children}</div>
      </motion.div>
    </div>
  );
}
