import { AppLanguages, AppLanguagesUtils } from "@/lib/app-languages";
import { LocalStorageKey } from "@/lib/local-storage-key";
import { atom } from "nanostores";

export const defaultLocale: AppLanguages = AppLanguagesUtils.defaultLanguage;
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

  let langAttribute = locale;

  if (locale === AppLanguages.SYSTEM) {
    if (typeof navigator !== "undefined") {
      const systemLang = navigator.language.split("-")[0];

      if (Object.values(AppLanguages).includes(systemLang as AppLanguages)) {
        langAttribute = systemLang as AppLanguages;
      } else {
        langAttribute = AppLanguagesUtils.defaultLanguage;
      }
    } else {
      langAttribute = AppLanguagesUtils.defaultLanguage;
    }
  }

  document.documentElement.lang = langAttribute;
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

  setLocale({ locale: AppLanguages.SYSTEM, persist: false });
}
