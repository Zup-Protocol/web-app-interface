import { triggerHaptic } from "@/lib/haptic";
import { Slot } from "@radix-ui/react-slot";
import { motion } from "framer-motion";
import * as React from "react";

interface ScaleClickAnimationProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
  asChild?: boolean;
  disabled?: boolean;
}

export function ScaleClickAnimation({
  children,
  className,
  scale = 0.96,
  asChild = false,
  disabled = false,
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
      stiffness: 400,
      damping: 25,
      mass: 0.5,
      restDelta: 0.001,
    } as any,
  };

  const finalProps = disabled ? {} : animationProps;

  if (asChild) {
    return (
      <Slot {...finalProps} className={className}>
        {children}
      </Slot>
    );
  }

  return (
    <motion.div className={className} {...finalProps}>
      {children}
    </motion.div>
  );
}
