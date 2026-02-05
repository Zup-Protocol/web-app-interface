import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { AppLanguages, AppLanguagesUtils } from "@/lib/app-languages";
import { $currentLocale, setLocale } from "@/stores/i18n";
import { useStore } from "@nanostores/react";

export function useTranslation() {
  const locale = useStore($currentLocale);

  function translate(key: AppTranslationsKeys) {
    return (
      AppLanguagesUtils.translations[locale][key] ||
      AppLanguagesUtils.translations[AppLanguages.ENGLISH][key] ||
      key
    );
  }

  function changeLocale(newLocale: AppLanguages) {
    setLocale({ locale: newLocale });
  }

  return { translate, locale, setLocale: changeLocale };
}
