import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import * as React from "react";

import { ScaleClickAnimation } from "@/components/ui/animations/scale-click-animation";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[12px] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[50px] px-5 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface PrimaryButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  alwaysIcon?: boolean;
  onRevealComplete?: () => void;
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      icon,
      alwaysIcon = false,
      onRevealComplete,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = (asChild ? Slot : motion.button) as any;
    const [isHovered, setIsHovered] = React.useState(false);

    React.useEffect(() => {
      let timer: NodeJS.Timeout;
      if (isHovered && !alwaysIcon && onRevealComplete) {
        timer = setTimeout(() => {
          onRevealComplete();
        }, 120);
      }
      return () => {
        if (timer) clearTimeout(timer);
      };
    }, [isHovered, alwaysIcon, onRevealComplete]);

    return (
      <ScaleClickAnimation asChild>
        <Comp
          {...props}
          {...(asChild ? {} : { layout: "size" })}
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...(asChild
            ? {
                onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
                  setIsHovered(true);
                  props.onMouseEnter?.(e);
                },
                onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
                  setIsHovered(false);
                  props.onMouseLeave?.(e);
                },
              }
            : {
                onHoverStart: () => setIsHovered(true),
                onHoverEnd: () => setIsHovered(false),
                transition: {
                  type: "spring",
                  stiffness: 450,
                  damping: 35,
                },
              })}
        >
          <div className="flex items-center justify-center">
            {icon && (
              <motion.div
                key="icon-container"
                initial={false}
                animate={{
                  width: alwaysIcon || isHovered ? "auto" : 0,
                  opacity: alwaysIcon || isHovered ? 1 : 0,
                  marginRight: (alwaysIcon || isHovered) && children ? 8 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 35,
                }}
                className="flex items-center justify-center shrink-0 overflow-hidden"
                style={{ overflow: "hidden" }}
              >
                {icon}
              </motion.div>
            )}
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
            >
              {children}
            </motion.span>
          </div>
        </Comp>
      </ScaleClickAnimation>
    );
  },
);
PrimaryButton.displayName = "PrimaryButton";

export { buttonVariants, PrimaryButton };
