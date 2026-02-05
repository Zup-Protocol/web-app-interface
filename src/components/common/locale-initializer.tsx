import { initLocale } from "@/stores/i18n";
import { useEffect } from "react";

export function LocaleInitializer() {
  useEffect(() => {
    initLocale();
  }, []);

  return null;
}
