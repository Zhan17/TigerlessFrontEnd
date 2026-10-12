import Image from "next/image";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CtaButton } from "@/features/shared/CtaButton";
import type { CategoryCardProps } from "./to-hero-props";

/**
 * Hero category card. The whole card is the hit area: the "See plans"
 * button's ::after stretches over the card (one real control, no nested
 * interactives). Self-designed states: hover = bubble lift + softer shadow
 * + image grows slightly, pressed = small shrink, focus = the button ring.
 */
export function CategoryCard({
  category,
  eyebrow,
  title,
  image,
  cta,
}: CategoryCardProps) {
  return (
    <article
      data-theme={category}
      className={[
        "group/card relative isolate flex h-55 flex-col justify-between overflow-hidden rounded-card bg-theme-surface p-card-pad shadow-card",
        "transition-[translate,scale,box-shadow] duration-(--duration-base) ease-standard",
        "hover:-translate-y-1 hover:shadow-soft has-[button:active]:scale-[0.98] has-[a:active]:scale-[0.98]",
        "xl:h-105.25",
      ].join(" ")}
    >
      {/*
        Product shot (design fill geometry). Stacked cards (fixed 220px tall)
        use a fixed 337px image anchored right, so wider screens keep the
        mobile composition; the 3-column cards (from xl, where they are wide enough for the
        desktop proportions) use the design's percentages.
      */}
      <div className="pointer-events-none absolute -top-6.5 -right-26.75 -z-10 aspect-square w-84.25 xl:top-[3.1%] xl:right-auto xl:left-[7.8%] xl:w-[131%]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 80rem) 36vw, 21rem"
          className="object-contain transition-[scale] duration-(--duration-slow) ease-standard group-hover/card:scale-[1.04]"
        />
      </div>

      <div className="relative flex flex-col gap-2 xl:gap-4">
        <Eyebrow tone="heading" size="lg">
          {eyebrow}
        </Eyebrow>
        <h3 className="max-w-[12.5rem] text-title font-medium text-ink-800 sm:max-w-[60%] xl:max-w-[64%]">
          {title}
        </h3>
      </div>

      {cta ? (
        // Not positioned: the button's ::after must stretch over the article.
        <div className="pt-6">
          <CtaButton
            cta={cta}
            variant="secondary"
            size="md"
            withArrow
            className="after:absolute after:inset-0 after:content-['']"
          />
        </div>
      ) : null}
    </article>
  );
}
