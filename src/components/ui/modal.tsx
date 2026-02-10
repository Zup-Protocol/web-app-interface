"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { KeyboardEventKey } from "@/lib/keyboard-event-keys";
import { ScreenBreakpoints } from "@/lib/screen-breakpoints";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  onOpenChange?: (open: boolean) => void;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  onOpen,
  onOpenChange,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  children,
  className,
}: ModalProps) {
  const isDesktop = useMediaQuery(ScreenBreakpoints.DESKTOP);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  useScrollLock({ enabled: isOpen });

  React.useEffect(() => {
    if (!mounted) return;

    if (isOpen) {
      onOpen?.();
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === KeyboardEventKey.Escape && closeOnEscape) {
        onClose();
        onOpenChange?.(false);
      }
    };

    if (isOpen && closeOnEscape) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, mounted, onOpen, onClose, onOpenChange, closeOnEscape]);

  const handleBackdropClick = () => {
    if (closeOnOverlayClick) {
      onClose();
      onOpenChange?.(false);
    }
  };

  if (!mounted) return null;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            data-testid="modal-backdrop"
            className="fixed inset-0 z-200 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div
            className={cn(
              "fixed z-201 flex pointer-events-none",
              isDesktop
                ? "inset-0 items-center justify-center p-4"
                : "inset-0 items-end justify-center p-0",
            )}
          >
            <motion.div
              initial={
                isDesktop ? { opacity: 0, scale: 0.95, y: 10 } : { y: "110%" }
              }
              animate={isDesktop ? { opacity: 1, scale: 1, y: 0 } : { y: 0 }}
              exit={
                isDesktop ? { opacity: 0, scale: 0.95, y: 10 } : { y: "110%" }
              }
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
              }}
              className={cn(
                "bg-modal pointer-events-auto border-modal-outline flex flex-col shadow-2xl overflow-hidden relative",
                isDesktop
                  ? "w-full max-w-5xl h-[85vh] rounded-[24px] border"
                  : "w-full max-h-[80vh] h-auto rounded-t-[24px] rounded-b-none border-t border-x border-b-0",
                className,
              )}
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
