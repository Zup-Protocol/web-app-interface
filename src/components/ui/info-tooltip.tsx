"use client";

import { InfoIcon, type InfoIconHandle } from "@/components/ui/icons/info";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

interface InfoTooltipProps {
  content: React.ReactNode;
  size?: number;
  className?: string;
}

export function InfoTooltip({
  content,
  size = 16,
  className,
}: InfoTooltipProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const iconRef = React.useRef<InfoIconHandle>(null);

  const trigger = (
    <button
      type="button"
      tabIndex={-1}
      className={cn(
        "inline-flex items-center justify-center text-mutated-text hover:text-foreground transition-colors cursor-help outline-none",
        className,
      )}
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
    >
      <InfoIcon ref={iconRef} size={size} />
    </button>
  );

  if (!isDesktop) {
    return (
      <Popover>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          sideOffset={8}
          className="w-auto max-w-[280px] px-3 py-2 text-sm bg-modal rounded-lg shadow-xl outline-1 outline-modal-outline"
        >
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root defaultOpen={false}>
        <TooltipPrimitive.Trigger asChild>{trigger}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={4}
            className="z-50 overflow-hidden rounded-lg bg-modal px-3 py-2 text-sm text-modal-foreground shadow-md outline-1 outline-modal-outline max-w-xs animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-modal" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
