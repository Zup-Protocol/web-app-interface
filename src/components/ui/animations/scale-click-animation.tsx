import { type HTMLMotionProps, m } from "framer-motion";
import * as React from "react";

import { triggerHaptic } from "@/lib/haptic";
import { Slot } from "@radix-ui/react-slot";

interface ScaleClickAnimationProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
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
  ...props
}: ScaleClickAnimationProps) {
  const [isTapping, setIsTapping] = React.useState(false);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsTapping(true);
    triggerHaptic(10);
    props.onPointerDown?.(event);
  };

  const handlePointerUpOrCancel = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    setTimeout(() => setIsTapping(false), 80);
    if (event.type === "pointerup") {
      props.onPointerUp?.(event);
    } else {
      props.onPointerCancel?.(event);
    }
  };

  const animationProps = {
    animate: {
      ...(typeof props.animate === "object" ? props.animate : {}),
      scale: isTapping
        ? scale
        : ((typeof props.animate === "object"
            ? (props.animate as any)?.scale
            : 1) ?? 1),
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
      ...(typeof props.transition === "object" ? props.transition : {}),
    },
    style: {
      transformOrigin: "center",
      willChange: "transform",
      ...(props.style as any),
    },
  };

  const finalProps = disabled ? {} : animationProps;
  const mergedProps = { ...props, ...finalProps };

  if (asChild) {
    return (
      <Slot {...(mergedProps as any)} className={className}>
        {children}
      </Slot>
    );
  }

  return (
    <m.div className={className} {...mergedProps}>
      {children}
    </m.div>
  );
}
