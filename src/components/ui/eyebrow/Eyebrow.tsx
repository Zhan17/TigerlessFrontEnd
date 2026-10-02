import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Small uppercase, letter-spaced label above headings ("HOW IT WORKS",
 * "WEIGHT LOSS", "FAQs", "CHECK YOUR ELIGIBILITY"). Static: no states.
 */
export const eyebrowVariants = cva("uppercase", {
  variants: {
    tone: {
      accent: "text-accent", // section eyebrows
      heading: "text-heading", // hero category cards
    },
    size: {
      md: "text-eyebrow", // 16
      lg: "text-eyebrow-lg", // 16 -> 18
    },
  },
  defaultVariants: { tone: "accent", size: "md" },
});

export type EyebrowProps = HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof eyebrowVariants>;

export function Eyebrow({ tone, size, className, ...props }: EyebrowProps) {
  return (
    <p className={cn(eyebrowVariants({ tone, size }), className)} {...props} />
  );
}
