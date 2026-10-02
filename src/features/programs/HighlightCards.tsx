import type { HighlightCard } from "@/content/schemas";
import { cn } from "@/lib/cn";

type Props = {
  cards: readonly HighlightCard[];
  className?: string;
};

// Fixed design widths that may shrink on very narrow screens (320).
const card =
  "min-w-0 shrink rounded-panel bg-surface p-highlight-pad shadow-raised text-stat-title font-medium text-heading-strong";

/**
 * Stat cards floating over a program photo (sleep): a metrics card
 * ("Olivia Gomes — 78 Normal · 89.5% Progress") and a progress card
 * ("Your profile — 82%"). Decorative content, but real text, so it stays
 * readable for assistive tech. Positioned by the parent section.
 */
export function HighlightCards({ cards, className }: Props) {
  return (
    <ul
      className={cn(
        "flex max-w-[calc(100%-0.5rem)] items-stretch gap-highlight-gap",
        className,
      )}
    >
      {cards.map((item) =>
        item.kind === "metrics" ? (
          <li key={item.id} className={cn(card, "w-highlight-metrics")}>
            <p className="border-b border-dashed border-border pb-3">
              {item.title}
            </p>
            <dl className="mt-3 flex flex-wrap gap-x-highlight-stat-gap gap-y-1 lg:mt-4">
              {item.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-baseline gap-2 lg:gap-3"
                >
                  <dt className="sr-only">{metric.label}</dt>
                  <dd className="text-stat font-normal text-ink-900">
                    {metric.value}
                  </dd>
                  <dd
                    aria-hidden
                    className="text-stat-label font-normal text-accent"
                  >
                    {metric.label}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ) : (
          <li key={item.id} className={cn(card, "w-highlight-progress")}>
            <p>{item.title}</p>
            <div
              role="progressbar"
              aria-label={item.title}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={item.percent}
              className="relative mt-7 h-1.5 overflow-hidden rounded-full bg-(image:--gradient-bmi)"
            >
              {/* Full-width gradient; the unfilled rest is covered. */}
              <div
                className="absolute inset-y-0 right-0 bg-border"
                style={{ width: `${100 - item.percent}%` }}
              />
            </div>
            <p
              aria-hidden
              className="mt-1.5 text-stat-label font-normal text-accent"
            >
              {item.percent}%
            </p>
          </li>
        ),
      )}
    </ul>
  );
}
