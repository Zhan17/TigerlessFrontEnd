import { CtaButton } from "@/features/shared/CtaButton";
import { RichText } from "@/features/shared/RichText";
import { uiCopy } from "@/lib/ui-copy";
import { CategoryCard } from "./CategoryCard";
import { LanguageMarquee } from "./LanguageMarquee";
import { TrustBadges } from "./TrustBadges";
import type { HeroProps } from "./to-hero-props";

/**
 * Hero inside the first white shell. The shell tucks under the sticky nav
 * (negative top margin = gutter + nav height - shell offset), is inset from
 * the page edge (12 -> 28) and caps at 1384px, centred, on wide screens.
 */
export function Hero({
  badges,
  headline,
  subtitle,
  cta,
  languages,
  highlightedLanguages,
  categories,
}: HeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className={[
        "mx-[max(var(--spacing-shell-inset),calc((100%-var(--container-shell))/2))]",
        "-mt-[calc(var(--spacing-gutter)+var(--spacing-nav)-var(--spacing-shell-top))]",
        "rounded-shell bg-surface px-shell-pad pt-hero-top pb-shell-pad",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-content flex-col items-center">
        <TrustBadges items={badges} />

        <h1
          id="hero-title"
          className="mt-3 max-w-[12.2em] text-center text-display font-medium text-heading"
        >
          <RichText segments={headline} />
        </h1>

        <p className="mt-4 text-center text-body text-copy">
          {subtitle.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>

        {cta ? (
          <CtaButton cta={cta} size="lg" withArrow className="mt-6" />
        ) : null}

        {languages.length > 0 ? (
          <div className="mt-hero-pills w-full">
            <LanguageMarquee
              languages={languages}
              highlighted={highlightedLanguages}
              label={uiCopy.hero.languages}
            />
          </div>
        ) : null}

        {categories.length > 0 ? (
          <ul className="mt-hero-cards grid w-full gap-6 xl:grid-cols-3">
            {categories.map((card) => (
              <li key={card.id}>
                <CategoryCard {...card} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
