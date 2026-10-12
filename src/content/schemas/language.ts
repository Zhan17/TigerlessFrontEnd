import { z } from "zod";

/**
 * GET /languages — languages available for consultations (hero pills).
 * Not the site UI language, which is English only.
 */
export const Language = z.object({
  /** BCP 47 tag, used as the element's `lang`. */
  code: z.string().min(2),
  /** Name in its own script: "Español", "中文", "العربية". */
  nativeName: z.string().min(1),
  dir: z.enum(["ltr", "rtl"]),
});

export const LanguageList = z.array(Language);

export type Language = z.infer<typeof Language>;
