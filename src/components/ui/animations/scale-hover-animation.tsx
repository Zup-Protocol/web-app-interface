import { type HTMLMotionProps, m } from "framer-motion";
import * as React from "react";

import { Slot } from "@radix-ui/react-slot";

interface ScaleHoverAnimationProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  scale?: number;
  asChild?: boolean;
  disabled?: boolean;
}

export function ScaleHoverAnimation({
  children,
  className,
  scale = 1.04,
  asChild = false,
  disabled = false,
  ...props
}: ScaleHoverAnimationProps) {
  const [isHovering, setIsHovering] = React.useState(false);

  const animationProps = {
    animate: {
      ...(typeof props.animate === "object" ? props.animate : {}),
      scale: isHovering
        ? scale
        : ((typeof props.animate === "object"
            ? (props.animate as any)?.scale
            : 1) ?? 1),
    },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.5,
      ...(typeof props.transition === "object" ? props.transition : {}),
    },
    onPointerEnter: (event: React.PointerEvent<HTMLDivElement>) => {
      setIsHovering(true);
      props.onPointerEnter?.(event);
    },
    onPointerLeave: (event: React.PointerEvent<HTMLDivElement>) => {
      setIsHovering(false);
      props.onPointerLeave?.(event);
    },
    style: {
      transformOrigin: "center",
      willChange: "transform",
      ...props.style,
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
