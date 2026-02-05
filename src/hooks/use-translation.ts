import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { AppLanguages, AppLanguagesUtils } from "@/lib/app-languages";
import { $currentLocale, setLocale } from "@/stores/i18n";
import { useStore } from "@nanostores/react";

export function useTranslation() {
  const locale = useStore($currentLocale);

  function translate(key: AppTranslationsKeys) {
    let effectiveLocale = locale;

    if (locale === AppLanguages.SYSTEM) {
      if (typeof navigator !== "undefined") {
        const systemLang = navigator.language.split("-")[0];
        if (Object.values(AppLanguages).includes(systemLang as AppLanguages)) {
          effectiveLocale = systemLang as AppLanguages;
        } else {
          effectiveLocale = AppLanguages.SYSTEM;
        }
      } else {
        effectiveLocale = AppLanguages.SYSTEM;
      }
    }

    return (
      AppLanguagesUtils.translations[effectiveLocale][key] ||
      AppLanguagesUtils.translations[AppLanguages.ENGLISH][key] ||
      key
    );
  }

  function changeLocale(newLocale: AppLanguages) {
    setLocale({ locale: newLocale });
  }

  return { translate, locale, setLocale: changeLocale };
}
