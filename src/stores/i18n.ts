import { AppLanguages, AppLanguagesUtils } from "@/lib/app-languages";
import { LocalStorage } from "@/lib/utils/local-storage-service";
import { atom } from "nanostores";

export const defaultLocale: AppLanguages = AppLanguagesUtils.defaultLanguage;
export const supportedAppLanguages: AppLanguages[] = AppLanguagesUtils.values;
export const $currentLocale = atom<AppLanguages>(defaultLocale);

export function setLocale({ locale, persist = true }: { locale: AppLanguages; persist?: boolean }) {
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
  if (persist) {
    LocalStorage.setLocale(locale);
  }
}

export function initLocale() {
  const savedLocale = LocalStorage.getLocale();

  if (savedLocale && supportedAppLanguages.includes(savedLocale)) {
    setLocale({ locale: savedLocale, persist: false });
  } else {
    setLocale({ locale: AppLanguages.SYSTEM, persist: false });
  }
}
