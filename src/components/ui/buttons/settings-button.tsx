"use client";

import { SettingsContent } from "@/components/settings/settings-content";
import { CogIcon, type CogIconHandle } from "@/components/ui/icons/cog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslation } from "@/hooks/use-translation";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { IconButton } from "./icon-button";

interface SettingsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function SettingsButton({ className, ...props }: SettingsButtonProps) {
  const cogRef = useRef<CogIconHandle>(null);
  const { translate } = useTranslation();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton
          className={cn("group h-[50px] w-[50px] border-border/10", className)}
          variant={"tertiary"}
          onMouseEnter={() => cogRef.current?.startAnimation()}
          onMouseLeave={() => cogRef.current?.stopAnimation()}
          {...props}
        >
          <CogIcon ref={cogRef} size={20} />
          <span className="sr-only">
            {translate(AppTranslationsKeys.HEADER_BUTTONS_SETTINGS)}
          </span>
        </IconButton>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[240px] p-4">
        <SettingsContent />
      </PopoverContent>
    </Popover>
  );
}
