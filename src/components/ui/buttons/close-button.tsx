"use client";

import { X } from "lucide-react";
import { IconButton, type IconButtonProps } from "./icon-button";

interface CloseButtonProps extends Omit<
  IconButtonProps,
  "children" | "variant"
> {
  iconSize?: number;
  variant?: "onModal" | "onBackground";
}

export function CloseButton({
  iconSize = 20,
  variant = "onModal",
  ...props
}: CloseButtonProps) {
  const iconButtonVariant =
    variant === "onModal" ? "tertiaryOnModal" : "tertiary";

  return (
    <IconButton
      variant={iconButtonVariant}
      size="sm"
      className="text-foreground"
      {...props}
    >
      <X size={iconSize} stroke="currentColor" />
    </IconButton>
  );
}
