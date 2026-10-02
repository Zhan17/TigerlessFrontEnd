import { CheckList } from "@/components/ui/check-list";
import { Eyebrow } from "@/components/ui/eyebrow";
import type {
  HowItWorksStep,
  RichText as RichTextContent,
} from "@/content/schemas";
import { RichText } from "@/features/shared/RichText";

export type HowItWorksProps = {
  eyebrow?: string;
  heading: RichTextContent;
  subtitle?: string;
  steps: HowItWorksStep[];
  footnote?: string;
};

/**
 * "How it works": intro + two step cards + a closing line. Static section
 * (no interaction states). F12: card content is top-aligned so both titles
 * sit on the same line regardless of how many points each card lists.
 */
export function HowItWorks({
  eyebrow,
  heading,
  subtitle,
  steps,
  footnote,
}: HowItWorksProps) {
  return (
    <section
      aria-labelledby="how-it-works-title"
      className="px-gutter py-section-y"
    >
      <div className="mx-auto flex max-w-content flex-col items-center text-center">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2
          id="how-it-works-title"
          className="mt-4 text-section font-medium text-balance text-heading"
        >
          <RichText segments={heading} />
        </h2>
        {subtitle ? (
          <p className="mt-4 max-w-[22.6rem] text-body text-copy">{subtitle}</p>
        ) : null}
      </div>

      <ol className="mx-auto mt-intro-cards grid max-w-[70rem] gap-8 md:grid-cols-2 md:gap-6">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className="flex flex-col rounded-card bg-surface px-card-pad pt-step-pt pb-step-pb shadow-card"
          >
            <span
              aria-hidden
              className="self-end text-step-number font-normal text-step"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-step-number-gap text-card-title font-medium text-heading">
              {step.title}
            </h3>
            <p className="mt-8 text-body text-copy">{step.description}</p>
            {step.points.length > 0 ? (
              <CheckList items={step.points} className="mt-4" />
            ) : null}
          </li>
        ))}
      </ol>

      {footnote ? (
        <p className="mx-auto mt-intro-cards max-w-content text-center text-lead font-medium text-heading">
          {footnote}
        </p>
      ) : null}
    </section>
  );
}
