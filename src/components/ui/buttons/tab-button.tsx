import { ScaleClickAnimation } from "@/components/ui/animations/scale-click-animation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import * as React from "react";

interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  activeColor?: "primary" | "foreground";
}

export const TabButton = React.forwardRef<HTMLButtonElement, TabButtonProps>(
  (
    { className, children, isActive, activeColor = "foreground", ...props },
    ref,
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const colors: Record<
      "primary" | "foreground",
      {
        text: string;
        hover: string;
        bg: string;
      }
    > = {
      primary: {
        text: "text-primary",
        hover: "hover:text-primary",
        bg: "bg-primary",
      },
      foreground: {
        text: "text-foreground",
        hover: "hover:text-foreground",
        bg: "bg-foreground",
      },
    };

    const activeStyles = colors[activeColor];

    return (
      <ScaleClickAnimation asChild scale={0.9}>
        <motion.button
          ref={ref}
          className={cn(
            "relative flex items-center gap-2 px-1 py-2 text-base font-medium text-mutated-text transition-colors cursor-pointer outline-none",
            activeStyles.hover,
            isActive && activeStyles.text,
            className,
          )}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          {...(props as any)}
        >
          {children}
          <motion.div
            className={cn(
              "absolute bottom-0 left-0 h-[2px] w-full",
              activeStyles.bg,
            )}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 80 }}
            style={{ originX: 0.5 }}
          />
        </motion.button>
      </ScaleClickAnimation>
    );
  },
);
TabButton.displayName = "TabButton";
