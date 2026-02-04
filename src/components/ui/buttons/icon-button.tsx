import { ScaleClickAnimation } from "@/components/ui/animations/scale-click-animation";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[12px] text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer overflow-hidden [&_svg]:stroke-current [&_svg]:fill-none [&_svg]:size-5",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary:
          "bg-secondary-button-background text-primary hover:bg-secondary-button-background-hover",
        tertiary:
          "bg-tertiary-button-background text-primary hover:bg-tertiary-button-background-hover",
        tertiaryOnModal:
          "bg-tertiary-button-on-modal-background text-primary hover:bg-tertiary-button-background-hover",
      },
      size: {
        default: "h-[50px] w-[50px]",
        sm: "h-9 w-9",
        lg: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface IconButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <ScaleClickAnimation scale={0.94}>
        <button
          className={cn(iconButtonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </button>
      </ScaleClickAnimation>
    );
  },
);
IconButton.displayName = "IconButton";
