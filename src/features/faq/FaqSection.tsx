import { Eyebrow } from "@/components/ui/eyebrow";
import { RichText } from "@/features/shared/RichText";
import { cn } from "@/lib/cn";
import { FaqAccordion } from "./FaqAccordion";
import type { FaqProps } from "./to-faq-props";

type Props = FaqProps & {
  defaultOpen?: string[];
  className?: string;
};

/**
 * "Frequently Asked Questions": intro on the left and the accordion on the
 * right from lg; stacked on mobile (where the board drops the eyebrow).
 * The section id is the anchor for the nav / footer "FAQs" links.
 */
export function FaqSection({
  eyebrow,
  heading,
  subtitle,
  items,
  defaultOpen,
  className,
}: Props) {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className={cn("px-gutter py-section-y", className)}
    >
      <div className="mx-auto grid max-w-content gap-6 lg:grid-cols-[2fr_3fr] lg:gap-12">
        <div>
          {eyebrow ? (
            <Eyebrow className="mb-4 hidden normal-case lg:block">
              {eyebrow}
            </Eyebrow>
          ) : null}
          {/* 8.35em: "Asked Questions" fits, "Frequently Asked" does not,
              so the heading breaks as on both boards at every size. */}
          <h2
            id="faq-title"
            className="max-w-[8.35em] text-section font-medium text-heading"
          >
            <RichText segments={heading} />
          </h2>
          {subtitle ? (
            <p className="mt-4 max-w-[32rem] text-body text-copy">{subtitle}</p>
          ) : null}
        </div>
        <FaqAccordion items={items} defaultOpen={defaultOpen} />
      </div>
    </section>
  );
}
