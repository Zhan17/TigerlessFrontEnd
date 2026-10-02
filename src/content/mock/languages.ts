import type { Language } from "../schemas";

// F06: Russian and Arabic were merged into one pill in the design.
export const languages: Language[] = [
  { code: "en", nativeName: "English", dir: "ltr" },
  { code: "zh", nativeName: "中文", dir: "ltr" },
  { code: "es", nativeName: "Español", dir: "ltr" },
  { code: "vi", nativeName: "Tiếng Việt", dir: "ltr" },
  { code: "ko", nativeName: "한국어", dir: "ltr" },
  { code: "tl", nativeName: "Tagalog", dir: "ltr" },
  { code: "ru", nativeName: "Русский", dir: "ltr" },
  { code: "ar", nativeName: "العربية", dir: "rtl" },
  { code: "fr", nativeName: "Français", dir: "ltr" },
  { code: "pt", nativeName: "Português", dir: "ltr" },
  { code: "hi", nativeName: "हिन्दी", dir: "ltr" },
];
