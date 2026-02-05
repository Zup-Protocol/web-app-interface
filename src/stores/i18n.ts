import { AppLanguages, AppLanguagesUtils } from "@/lib/app-languages";
import { LocalStorageKey } from "@/lib/local-storage-key";
import { atom } from "nanostores";

export const defaultLocale: AppLanguages = AppLanguages.ENGLISH;
export const supportedAppLanguages: AppLanguages[] = AppLanguagesUtils.values;
export const $currentLocale = atom<AppLanguages>(defaultLocale);

export function setLocale({
  locale,
  persist = true,
}: {
  locale: AppLanguages;
  persist?: boolean;
}) {
  $currentLocale.set(locale);
  document.documentElement.lang = locale;
  if (persist && typeof localStorage !== "undefined") {
    localStorage.setItem(LocalStorageKey.LOCALE, locale);
  }
}

export function initLocale() {
  if (typeof localStorage === "undefined") return;

  const savedLocale = localStorage.getItem(
    LocalStorageKey.LOCALE,
  ) as AppLanguages;

  if (savedLocale && supportedAppLanguages.includes(savedLocale)) {
    setLocale({ locale: savedLocale, persist: false });

    return;
  }

  const systemLocale = navigator.language.split("-")[0] as AppLanguages;

  if (supportedAppLanguages.includes(systemLocale)) {
    setLocale({ locale: systemLocale, persist: false });

    return;
  }

  setLocale({ locale: defaultLocale, persist: false });
}
