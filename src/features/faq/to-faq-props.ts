import { pickByIds } from "@/content/api/pick-by-ids";
import type { Faq, HomeContent, RichText } from "@/content/schemas";

export type FaqProps = {
  eyebrow: string | null;
  heading: RichText;
  subtitle: string | null;
  items: Faq[];
};

/** API content -> FAQ section (order from home content). */
export function toFaqProps(home: HomeContent, faqs: readonly Faq[]): FaqProps {
  const { eyebrow, heading, subtitle, faqIds } = home.faq;
  return {
    eyebrow: eyebrow ?? null,
    heading,
    subtitle: subtitle ?? null,
    items: pickByIds(faqIds, faqs),
  };
}
