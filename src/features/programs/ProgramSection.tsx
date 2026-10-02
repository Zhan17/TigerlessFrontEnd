import Image from "next/image";
import type { ReactNode } from "react";
import { CheckList } from "@/components/ui/check-list";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Price } from "@/components/ui/price";
import { CtaButton } from "@/features/shared/CtaButton";
import { RichText } from "@/features/shared/RichText";
import { cn } from "@/lib/cn";
import { ProductCard } from "./ProductCard";
import type { ProgramSectionProps } from "./to-programs-props";

type Props = ProgramSectionProps & {
  /** Extra blocks inside the section after the products (e.g. BMI). */
  children?: ReactNode;
  className?: string;
};

/**
 * One program (weight loss / birth control / sleep): a themed feature card
 * with copy, optional price and CTA, and a cut-out photo that rises above
 * the card. Below lg the card stacks (copy, then photo at the bottom, as on
 * the mobile board); from lg it is two columns with the photo anchored to
 * the bottom edge. Products follow when the program has any.
 *
 * The section carries the program id as its anchor for nav links.
 */
export function ProgramSection({
  id,
  category,
  imageSide,
  eyebrow,
  heading,
  intro,
  points,
  startingPrice,
  cta,
  image,
  products,
  children,
  className,
}: Props) {
  const imageLeft = imageSide === "left";
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("px-gutter", className)}
    >
      <div
        data-theme={category}
        className="relative mx-auto grid max-w-content grid-cols-[minmax(0,1fr)] rounded-feature bg-theme-surface lg:min-h-154.75 lg:grid-cols-2"
      >
        <div
          className={cn(
            "flex flex-col justify-center p-feature-pad lg:py-feature-pad",
            imageLeft
              ? "lg:col-start-2 lg:pr-[calc(var(--spacing-feature-pad)*2)]"
              : "lg:pl-[calc(var(--spacing-feature-pad)*2)]",
          )}
        >
          {eyebrow ? (
            <Eyebrow className="mb-4 hidden lg:block">{eyebrow}</Eyebrow>
          ) : null}
          <h2
            id={`${id}-title`}
            className="max-w-[28.5rem] text-section font-medium text-ink-900"
          >
            <RichText segments={heading} />
          </h2>
          {intro.length > 0 ? (
            <div className="mt-4 flex max-w-[38rem] flex-col gap-1 text-body text-copy lg:mt-8">
              {intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : null}
          {points.length > 0 ? (
            <CheckList items={points} className="mt-4 lg:mt-5" />
          ) : null}
          {startingPrice ? (
            <div className="mt-6 max-w-[38rem] border-t border-theme-divider pt-6 lg:mt-8 lg:pt-8">
              <Price
                amountMinor={startingPrice.amountMinor}
                currency={startingPrice.currency}
                interval={startingPrice.interval}
              />
            </div>
          ) : null}
          <div className={startingPrice ? "mt-4" : "mt-6 lg:mt-9"}>
            <CtaButton
              cta={cta}
              variant="secondary"
              size="responsive"
              fullWidth="belowLg"
              withArrow
            />
          </div>
        </div>

        {/* Cut-out photo: below the copy on mobile, bottom-anchored half on desktop. */}
        <div
          className={cn(
            "relative mx-auto aspect-[1185/1327] w-[calc(100%-1.125rem)] max-w-sm",
            "lg:absolute lg:bottom-0 lg:mx-0 lg:aspect-[682/692] lg:w-[51.7%] lg:max-w-none",
            imageLeft ? "lg:left-[1.3%]" : "lg:left-[44.8%]",
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 64rem) 50vw, 24rem"
            className="object-contain object-bottom"
          />
        </div>
      </div>

      {products.length > 0 ? (
        <ul className="mx-auto mt-8 grid max-w-content gap-8 md:grid-cols-2">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard {...product} />
            </li>
          ))}
        </ul>
      ) : null}

      {children}
    </section>
  );
}
