"use client";

import { Dropdown } from "@/components/ui/dropdown";
import { CogIcon, type CogIconHandle } from "@/components/ui/icons/cog";
import { MonitorIcon } from "@/components/ui/icons/monitor";
import { MoonIcon } from "@/components/ui/icons/moon";
import { SunIcon } from "@/components/ui/icons/sun";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeMode } from "@/lib/theme-mode";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useRef } from "react";
import { IconButton } from "./icon-button";

interface SettingsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function SettingsButton({ className, ...props }: SettingsButtonProps) {
  const cogRef = useRef<CogIconHandle>(null);
  const { setTheme, theme, resolvedTheme, systemTheme } = useTheme();

  const themeItems = [
    { value: ThemeMode.LIGHT, label: "Light", icon: <SunIcon size={16} /> },
    { value: ThemeMode.DARK, label: "Dark", icon: <MoonIcon size={16} /> },
    {
      value: ThemeMode.SYSTEM,
      label: "System",
      icon: <MonitorIcon size={16} />,
    },
  ];

  const handleThemeChange = (newTheme: ThemeMode) => {
    if (newTheme === theme) return;

    const effectiveNewTheme =
      newTheme === ThemeMode.SYSTEM ? systemTheme : newTheme;
    const isVisuallyChanging = effectiveNewTheme !== resolvedTheme;

    if (!isVisuallyChanging) {
      setTheme(newTheme);
      return;
    }

    // If it WILL change visually, we wait for the dropdown to close before animating
    setTimeout(() => {
      if (
        !(document as any).startViewTransition ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        setTheme(newTheme);
        return;
      }

      (document as any).startViewTransition(() => {
        setTheme(newTheme);
      });
    }, 300);
  };

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
          <span className="sr-only">Settings</span>
        </IconButton>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[240px] p-4">
        <h2 className="mb-3 text-sm font-medium">Theme Mode</h2>
        <Dropdown
          variant={"tertiaryOnPopover"}
          items={themeItems}
          selected={(theme as ThemeMode) || ThemeMode.SYSTEM}
          onSelect={handleThemeChange}
          placeholder="Select theme"
        />
      </PopoverContent>
    </Popover>
  );
}
