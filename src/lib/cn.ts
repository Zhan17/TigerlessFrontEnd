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
        "price",
        "price-unit",
        "price-sm",
        "price-sm-unit",
        "caption",
      ],
      shadow: ["card", "soft", "pill", "raised", "layered"],
      radius: ["shell", "card", "panel"],
      spacing: ["gutter", "shell-inset", "pill", "pill-x"],
      container: ["shell", "content"],
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
