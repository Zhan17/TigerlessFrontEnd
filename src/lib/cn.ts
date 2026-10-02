import { type CxOptions, cx } from "class-variance-authority";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's default theme. Register the custom
 * tokens from globals.css so it can tell e.g. `text-button` (font size) from
 * `text-on-primary` (colour) and does not drop one of them as a "conflict".
 * Keep these lists in sync with the @theme block.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "display",
        "section",
        "card-title",
        "card-heading",
        "product-title",
        "title",
        "body",
        "body-sm",
        "button",
        "label",
        "badge",
        "eyebrow",
        "eyebrow-lg",
        "lead",
        "strip",
        "step-number",
        "score",
        "price",
        "price-unit",
        "price-sm",
        "price-sm-unit",
        "stat-title",
        "stat",
        "stat-label",
        "chat-title",
        "chat",
        "chat-meta",
        "author",
        "meta",
        "cta",
        "cta-point",
        "footer",
        "footer-title",
        "caption",
      ],
      shadow: ["card", "soft", "pill", "raised", "layered"],
      radius: ["shell", "card", "panel", "feature", "bubble"],
      spacing: [
        "gutter",
        "shell-inset",
        "shell-pad",
        "shell-top",
        "hero-top",
        "hero-pills",
        "hero-cards",
        "fade",
        "card-pad",
        "pill",
        "pill-x",
        "pill-gap",
        "badge-gap",
        "nav",
        "section-y",
        "strip-top",
        "strip-gap",
        "intro-cards",
        "step-number-gap",
        "step-pt",
        "step-pb",
        "feature-pad",
        "program-gap",
        "control",
        "product-media",
        "program-photo",
        "highlight-pad",
        "highlight-gap",
        "highlight-inset",
        "highlight-bottom",
        "highlight-metrics",
        "highlight-progress",
        "highlight-stat-gap",
        "carousel-top",
        "carousel-gap",
        "service-w",
        "service-h",
        "service-gap",
        "phone-w",
        "phone-top",
        "chat-bottom",
        "stories-y",
        "story-h",
        "faq-pad",
        "footer-x",
        "cta-bottom",
        "footer-top",
        "wordmark",
      ],
      container: ["shell", "content", "footer"],
      ease: ["out-expo", "standard"],
    },
  },
});

/**
 * Join conditional class names and resolve Tailwind conflicts
 * (later utilities win, e.g. `cn("px-4", "px-6")` -> "px-6").
 */
export function cn(...inputs: CxOptions): string {
  return twMerge(cx(inputs));
}
