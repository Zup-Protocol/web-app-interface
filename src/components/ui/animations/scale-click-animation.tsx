import { triggerHaptic } from "@/lib/haptic";
import { Slot } from "@radix-ui/react-slot";
import { motion } from "framer-motion";
import * as React from "react";

interface ScaleClickAnimationProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
  asChild?: boolean;
}

export function ScaleClickAnimation({
  children,
  className,
  scale = 0.96,
  asChild = false,
}: ScaleClickAnimationProps) {
  const [isTapping, setIsTapping] = React.useState(false);

  const handlePointerDown = () => {
    setIsTapping(true);
    triggerHaptic(10);
  };

  const handlePointerUpOrCancel = () => {
    setTimeout(() => setIsTapping(false), 80);
  };

  const animationProps = {
    animate: {
      scale: isTapping ? scale : 1,
    },
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUpOrCancel,
    onPointerCancel: handlePointerUpOrCancel,
    transition: {
      type: "spring",
      stiffness: 600,
      damping: 30,
      mass: 0.5,
    } as any,
  };

  if (asChild) {
    return (
      <Slot {...animationProps} className={className}>
        {children}
      </Slot>
    );
  }

  return (
    <motion.div className={className} {...animationProps}>
      {children}
    </motion.div>
  );
}
