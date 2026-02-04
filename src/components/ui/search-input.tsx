"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import * as React from "react";
import { SearchIcon, type SearchIconHandle } from "./icons/search";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, containerClassName, onClear, ...props }, ref) => {
    const iconRef = React.useRef<SearchIconHandle>(null);
    const [isHovered, setIsHovered] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    React.useEffect(() => {
      if (isHovered || isFocused) {
        iconRef.current?.startAnimation();
      } else {
        iconRef.current?.stopAnimation();
      }
    }, [isHovered, isFocused]);

    return (
      <div
        className={cn("relative w-full group", containerClassName)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <SearchIcon
          ref={iconRef}
          className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-hover:text-foreground"
          size={18}
        />
        <input
          {...props}
          ref={ref}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={cn(
            "w-full bg-foreground/5 border border-foreground/10 rounded-[14px] py-3 pl-11 pr-12 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all hover:bg-foreground/8",
            className,
          )}
        />
        <AnimatePresence>
          {props.value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={onClear}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-foreground/10 transition-colors cursor-pointer z-20"
            >
              <X
                size={16}
                className="text-foreground transition-colors"
                strokeWidth={2.5}
              />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
