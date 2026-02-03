import { ScaleClickAnimation } from "@/components/ui/animations/scale-click-animation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import * as React from "react";

interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

export const TabButton = React.forwardRef<HTMLButtonElement, TabButtonProps>(
  ({ className, children, isActive, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
      <ScaleClickAnimation asChild scale={0.97}>
        <motion.button
          ref={ref}
          className={cn(
            "relative flex items-center gap-2 px-1 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer outline-none",
            isActive && "text-foreground",
            className,
          )}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          {...(props as any)}
        >
          {children}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] w-full bg-foreground"
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
