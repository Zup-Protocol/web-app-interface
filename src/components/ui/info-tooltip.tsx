"use client";

import { InfoIcon, type InfoIconHandle } from "@/components/ui/icons/info";
import { Modal } from "@/components/ui/modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { KeyboardEventKey } from "@/lib/keyboard-event-keys";
import { ScreenBreakpoints } from "@/lib/screen-breakpoints";
import { cn } from "@/lib/utils";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

interface InfoTooltipProps {
  content: React.ReactNode;
  size?: number;
  className?: string;
  contentClassName?: string;
  showModalOnMobile?: boolean;
  padding?: string | number;
}

export function InfoTooltip({
  content,
  size = 16,
  className,
  contentClassName,
  showModalOnMobile = false,
  padding = "10px",
}: InfoTooltipProps) {
  const isDesktop = useMediaQuery(ScreenBreakpoints.DESKTOP);
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const iconRef = React.useRef<InfoIconHandle>(null);

  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>(null);

  const openTooltip = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);

    setIsOpen(true);
    iconRef.current?.startAnimation();
  };

  const closeTooltip = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      iconRef.current?.stopAnimation();
    }, 150);
  };

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
      onClick={(e) => {
        if (!isDesktop && showModalOnMobile) {
          e.stopPropagation();
          setIsOpen(true);
        }
      }}
    >
      <InfoIcon ref={iconRef} size={size} />
    </button>
  );

  if (!isDesktop) {
    if (showModalOnMobile) {
      const modalContent = React.isValidElement(content)
        ? React.cloneElement(content as React.ReactElement<any>, {
            onClose: () => setIsOpen(false),
          })
        : content;

      return (
        <>
          {trigger}
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div
              className={cn("flex flex-col flex-1 min-h-0", contentClassName)}
              style={{ padding }}
            >
              {modalContent}
            </div>
          </Modal>
        </>
      );
    }

    return (
      <Popover>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          sideOffset={8}
          collisionPadding={20}
          style={{
            maxHeight:
              "min(480px, var(--radix-popover-content-available-height))",
            padding,
          }}
          className={cn(
            "z-200 w-auto max-w-[280px] bg-modal rounded-lg outline-1 outline-modal-outline overflow-hidden flex flex-col",
            contentClassName,
          )}
        >
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root open={isOpen}>
        <TooltipPrimitive.Trigger asChild>
          <button
            ref={triggerRef}
            type="button"
            className={cn(
              "inline-flex items-center justify-center text-mutated-text hover:text-foreground transition-colors cursor-help outline-none",
              className,
            )}
            onMouseEnter={openTooltip}
            onMouseLeave={closeTooltip}
            onClick={() => {
              if (closeTimeoutRef.current)
                clearTimeout(closeTimeoutRef.current);
              setIsOpen((prev) => !prev);
            }}
            onKeyDown={(e) => {
              if (e.key === KeyboardEventKey.Escape) {
                setIsOpen(false);
              }
            }}
          >
            <InfoIcon ref={iconRef} size={size} />
          </button>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side="right"
            align="start"
            sideOffset={10}
            alignOffset={-12}
            collisionPadding={20}
            style={{
              maxHeight:
                "min(480px, var(--radix-tooltip-content-available-height))",
              padding,
            }}
            className={cn(
              "z-200 overflow-hidden rounded-lg bg-modal text-sm text-modal-foreground outline-1 outline-modal-outline max-w-xs animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 flex flex-col",
              contentClassName,
            )}
            onPointerDownOutside={(e) => {
              if (
                triggerRef.current &&
                triggerRef.current.contains(e.target as Node)
              ) {
                e.preventDefault();
              } else {
                setIsOpen(false);
              }
            }}
            onEscapeKeyDown={() => setIsOpen(false)}
            onMouseEnter={() => {
              if (closeTimeoutRef.current)
                clearTimeout(closeTimeoutRef.current);
            }}
            onMouseLeave={closeTooltip}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-modal" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
