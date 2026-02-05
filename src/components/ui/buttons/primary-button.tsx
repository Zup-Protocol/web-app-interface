import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

import { cn } from "@/lib/utils";
import { ScaleClickAnimation } from "../animations/scale-click-animation";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[12px] font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        outline:
          "border border-outline-button-border bg-background hover:bg-outline-button-hover hover:text-foreground",
        tertiary:
          "bg-tertiary-button-background text-foreground hover:bg-tertiary-button-background-hover",
        disabled:
          "bg-disabled-button-background text-disabled-button-foreground cursor-default",
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
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.matchMedia("(max-width: 768px)").matches);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    React.useEffect(() => {
      let timer: NodeJS.Timeout;
      if (isHovered && onRevealComplete) {
        timer = setTimeout(() => {
          onRevealComplete();
        }, 120);
      }
      return () => {
        if (timer) clearTimeout(timer);
      };
    }, [isHovered, onRevealComplete]);

    const showIcon = alwaysIcon || isHovered || isMobile;

    const buttonContent = (
      <Comp
        {...props}
        {...(asChild ? {} : { layout: true })}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...(asChild
          ? {
              onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
                if (variant === "disabled") return;
                setIsHovered(true);
                props.onMouseEnter?.(e);
              },
              onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
                if (variant === "disabled") return;
                setIsHovered(false);
                props.onMouseLeave?.(e);
              },
            }
          : {
              onHoverStart: () => {
                if (variant === "disabled") return;
                setIsHovered(true);
              },
              onHoverEnd: () => {
                if (variant === "disabled") return;
                setIsHovered(false);
              },
              transition: {
                type: "spring",
                stiffness: 450,
                damping: 35,
                mass: 0.8,
              },
            })}
      >
        <motion.div
          layout
          className="flex items-center justify-center h-full w-full"
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 35,
            mass: 0.8,
          }}
        >
          {icon && (
            <motion.div
              key="icon-container"
              layout
              initial={false}
              animate={{
                width: showIcon ? "auto" : 0,
                opacity: showIcon ? 1 : 0,
                marginRight: showIcon && children ? 8 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 35,
                mass: 0.8,
              }}
              className="flex items-center justify-center shrink-0"
              style={{ overflow: "hidden" }}
            >
              {icon}
            </motion.div>
          )}
          <motion.span
            layout
            transition={{
              type: "spring",
              stiffness: 450,
              damping: 35,
              mass: 0.8,
            }}
            className="inline-flex items-center justify-center relative"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={typeof children === "string" ? children : "content"}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
              >
                {children}
              </motion.span>
            </AnimatePresence>
          </motion.span>
        </motion.div>
      </Comp>
    );

    return (
      <ScaleClickAnimation asChild disabled={variant === "disabled"}>
        {buttonContent}
      </ScaleClickAnimation>
    );
  },
);
PrimaryButton.displayName = "PrimaryButton";

export { buttonVariants, PrimaryButton };
