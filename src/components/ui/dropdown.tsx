"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const dropdownTriggerVariants = cva(
  "flex h-12 w-full items-center justify-between rounded-[12px] px-3 py-2 text-base transition-all disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer",
  {
    variants: {
      variant: {
        outline:
          "border border-outline-button-border bg-transparent hover:bg-outline-button-hover text-foreground outline-none",
        tertiary:
          "bg-tertiary-button-background text-foreground hover:bg-tertiary-button-background-hover outline-none",
        tertiaryOnModal:
          "bg-tertiary-button-on-modal-background text-foreground hover:bg-tertiary-button-on-modal-background-hover outline-none",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  },
);

const dropdownContentVariants = cva("", {
  variants: {
    variant: {
      outline: "bg-modal outline-modal-outline",
      tertiary: "bg-tertiary-button-background outline-outline-button-border",
      tertiaryOnModal:
        "bg-tertiary-button-on-modal-background outline-modal-outline",
    },
  },
  defaultVariants: {
    variant: "outline",
  },
});

const dropdownItemVariants = cva(
  "relative flex w-full cursor-pointer select-none items-center rounded-lg p-4 text-base outline-none transition-colors data-disabled:pointer-events-none data-disabled:opacity-50",
  {
    variants: {
      variant: {
        outline: "hover:bg-accent hover:text-accent-foreground",
        tertiary: "hover:bg-tertiary-button-background-hover",
        tertiaryOnModal: "hover:bg-tertiary-button-on-modal-background-hover",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  },
);

export interface DropdownItem<T> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps<T> extends VariantProps<
  typeof dropdownTriggerVariants
> {
  items: DropdownItem<T>[];
  selected: T;
  onSelect: (value: T) => void;
  placeholder?: string;
  className?: string;
}

import { type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    } as const,
  },
};

export function Dropdown<T extends string | number>({
  items,
  selected,
  onSelect,
  placeholder = "Select...",
  className,
  variant,
}: DropdownProps<T>) {
  const [open, setOpen] = React.useState(false);
  const triggerIconRef = React.useRef<any>(null);

  const selectedItem = items.find((item) => item.value === selected);

  const handleMouseEnter = () => {
    if (triggerIconRef.current?.startAnimation) {
      triggerIconRef.current.startAnimation();
    }
  };

  const handleMouseLeave = () => {
    if (triggerIconRef.current?.stopAnimation) {
      triggerIconRef.current.stopAnimation();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(dropdownTriggerVariants({ variant, className }))}
        >
          <span className="flex items-center gap-2 truncate">
            {selectedItem?.icon && (
              <span className="h-4 w-4 shrink-0">
                {React.isValidElement(selectedItem.icon)
                  ? React.cloneElement(
                      selectedItem.icon as React.ReactElement,
                      {
                        ref: triggerIconRef,
                      } as any,
                    )
                  : selectedItem.icon}
              </span>
            )}
            <span className="truncate">
              {selectedItem?.label ?? placeholder}
            </span>
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-[--radix-popover-trigger-width] min-w-[150px] p-3",
          dropdownContentVariants({ variant }),
        )}
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <motion.div
          className="flex flex-col gap-1"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {items.map((item) => (
            <motion.div key={String(item.value)} variants={itemVariants}>
              <DropdownItemRow
                item={item}
                selected={selected === item.value}
                onSelect={() => {
                  onSelect(item.value);
                  setOpen(false);
                }}
                variant={variant}
              />
            </motion.div>
          ))}
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}

function DropdownItemRow<T>({
  item,
  selected,
  onSelect,
  variant,
}: {
  item: DropdownItem<T>;
  selected: boolean;
  onSelect: () => void;
  variant: VariantProps<typeof dropdownTriggerVariants>["variant"];
}) {
  const iconRef = React.useRef<any>(null);

  const handleMouseEnter = () => {
    if (iconRef.current?.startAnimation) {
      iconRef.current.startAnimation();
    }
  };

  const handleMouseLeave = () => {
    if (iconRef.current?.stopAnimation) {
      iconRef.current.stopAnimation();
    }
  };

  return (
    <button
      onClick={onSelect}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        dropdownItemVariants({ variant }),
        selected && "text-primary font-medium",
      )}
    >
      <div className="flex items-center gap-2">
        {item.icon && (
          <span className="flex h-4 w-4 items-center justify-center">
            {React.isValidElement(item.icon)
              ? React.cloneElement(
                  item.icon as React.ReactElement,
                  {
                    ref: iconRef,
                  } as any,
                )
              : item.icon}
          </span>
        )}
        <span>{item.label}</span>
      </div>
      {selected && (
        <span className="absolute right-5 flex h-3.5 w-3.5 items-center justify-center">
          <Check className="h-4 w-4 text-primary" />
        </span>
      )}
    </button>
  );
}
