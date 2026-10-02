import type { VariantProps } from "class-variance-authority";
import {
  Button,
  ButtonLink,
  type buttonVariants,
} from "@/components/ui/button";
import type { Cta } from "@/content/schemas";
import { hrefFor } from "./link";

type CtaButtonProps = VariantProps<typeof buttonVariants> & {
  cta: Cta;
  className?: string;
};

/**
 * Renders a content CTA: a link when it has a destination, otherwise a
 * button that only gives press feedback (decisions Q1 / C3).
 */
export function CtaButton({ cta, ...props }: CtaButtonProps) {
  const href = hrefFor(cta.link);
  return href ? (
    <ButtonLink href={href} {...props}>
      {cta.label}
    </ButtonLink>
  ) : (
    <Button {...props}>{cta.label}</Button>
  );
}
