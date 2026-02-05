import spainFlag from "@/assets/flags/spain.svg";
import usaFlag from "@/assets/flags/usa.svg";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { en } from "@/i18n/locales/en";
import { es } from "@/i18n/locales/es";

export enum AppLanguages {
  ENGLISH = "en",
  SPANISH = "es",
}

export abstract class AppLanguagesUtils {
  static values = Object.values(AppLanguages).filter(
    (v) => typeof v === "string",
  ) as AppLanguages[];

  static flag: Record<AppLanguages, ImageMetadata | string> = {
    [AppLanguages.ENGLISH]: usaFlag,
    [AppLanguages.SPANISH]: spainFlag,
  };

  static nameKey: Record<AppLanguages, AppTranslationsKeys> = {
    [AppLanguages.ENGLISH]: AppTranslationsKeys.SETTINGS_LANGUAGE_EN,
    [AppLanguages.SPANISH]: AppTranslationsKeys.SETTINGS_LANGUAGE_ES,
  };

  static translations: Record<
    AppLanguages,
    Record<AppTranslationsKeys, string>
  > = {
    [AppLanguages.ENGLISH]: en,
    [AppLanguages.SPANISH]: es,
  };

  static getLanguageName(
    language: AppLanguages,
    translate: (key: AppTranslationsKeys) => string,
  ): string {
    return translate(this.nameKey[language]);
  }
}
