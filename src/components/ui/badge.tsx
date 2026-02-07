import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

interface BadgeProps extends HTMLMotionProps<"span"> {
  variant?: "dot";
}

export function Badge({ className, variant = "dot", ...props }: BadgeProps) {
  if (variant === "dot") {
    return (
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className={cn(
          "absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-400 rounded-full border-2 border-background z-10",
          className,
        )}
        {...props}
      />
    );
  }

  return null;
}
