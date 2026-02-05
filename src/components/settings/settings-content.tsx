"use client";

import { Dropdown, type DropdownItem } from "@/components/ui/dropdown";
import { MonitorIcon } from "@/components/ui/icons/monitor";
import { MoonIcon } from "@/components/ui/icons/moon";
import { SunIcon } from "@/components/ui/icons/sun";
import { useTranslation } from "@/hooks/use-translation";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { AppLanguages, AppLanguagesUtils } from "@/lib/app-languages";
import { ThemeMode } from "@/lib/theme-mode";
import { Languages } from "lucide-react";
import { useTheme } from "next-themes";

export function SettingsContent() {
  const { setTheme, theme, resolvedTheme, systemTheme } = useTheme();
  const { translate, locale, setLocale } = useTranslation();

  const themeItems = [
    {
      value: ThemeMode.LIGHT,
      label: translate(AppTranslationsKeys.SETTINGS_THEME_LIGHT),
      icon: <SunIcon size={16} />,
    },
    {
      value: ThemeMode.DARK,
      label: translate(AppTranslationsKeys.SETTINGS_THEME_DARK),
      icon: <MoonIcon size={16} />,
    },
    {
      value: ThemeMode.SYSTEM,
      label: translate(AppTranslationsKeys.SETTINGS_THEME_SYSTEM),
      icon: <MonitorIcon size={16} />,
    },
  ];

  const languageItems: DropdownItem<AppLanguages>[] =
    AppLanguagesUtils.values.map((lang) => {
      if (lang === AppLanguages.SYSTEM) {
        return {
          value: lang,
          label: AppLanguagesUtils.getLanguageName(lang, translate),
          icon: <Languages size={16} />,
        };
      }

      const flag = AppLanguagesUtils.flag[lang];
      const flagSrc = typeof flag === "string" ? flag : flag.src;

      return {
        value: lang,
        label: AppLanguagesUtils.getLanguageName(lang, translate),
        icon: (
          <img
            src={flagSrc}
            alt={AppLanguagesUtils.getLanguageName(lang, translate)}
            className="w-4 h-4 rounded-full object-cover"
          />
        ),
      };
    });

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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-base font-medium">
          {translate(AppTranslationsKeys.SETTINGS_THEME_TITLE)}
        </h2>
        <Dropdown
          variant={"tertiaryOnModal"}
          items={themeItems}
          selected={(theme as ThemeMode) || ThemeMode.SYSTEM}
          onSelect={handleThemeChange}
          placeholder={translate(
            AppTranslationsKeys.SETTINGS_THEME_PLACEHOLDER,
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-base font-medium">
          {translate(AppTranslationsKeys.SETTINGS_LANGUAGE_TITLE)}
        </h2>
        <Dropdown
          variant={"tertiaryOnModal"}
          items={languageItems}
          selected={locale}
          onSelect={(value) => setLocale(value as any)}
          placeholder={translate(
            AppTranslationsKeys.SETTINGS_LANGUAGE_PLACEHOLDER,
          )}
        />
      </div>
    </div>
  );
}
