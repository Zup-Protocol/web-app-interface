"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface UsdInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  value: string;
  onValueChange: (value: string) => void;
  containerClassName?: string;
}

export const UsdInput = React.forwardRef<HTMLInputElement, UsdInputProps>(
  ({ className, containerClassName, value, onValueChange, ...props }, ref) => {
    const formatNumber = (numericValue: string): string => {
      if (!numericValue) return "";
      const number = parseInt(numericValue, 10);

      if (isNaN(number)) return "";
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const parseNumber = (formattedValue: string): string => {
      return formattedValue.replace(/\s/g, "");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = parseNumber(e.target.value);
      if (rawValue === "" || /^\d+$/.test(rawValue)) {
        onValueChange(rawValue);
      }
    };

    return (
      <div
        className={cn(
          "relative flex items-center w-full rounded-[12px] bg-foreground/5 border border-foreground/10 transition-all hover:bg-foreground/8 focus-within:ring-2 focus-within:ring-primary/40",
          containerClassName,
        )}
      >
        <input
          {...props}
          ref={ref}
          type="text"
          inputMode="numeric"
          value={formatNumber(value)}
          onChange={handleChange}
          className={cn(
            "w-full bg-transparent py-3 pl-4 pr-16 text-base text-foreground focus:outline-none",
            className,
          )}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-mutated-text text-base select-none pointer-events-none">
          USD
        </span>
      </div>
    );
  },
);

UsdInput.displayName = "UsdInput";
