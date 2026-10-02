import Image from "next/image";
import { Price } from "@/components/ui/price";
import { CtaButton } from "@/features/shared/CtaButton";
import type { ProductCardProps } from "./to-programs-props";

/**
 * Product card under a program (weight loss): product shot, name, price and
 * a button (full width on mobile, inline with the price from lg). The card
 * itself is not interactive; the button carries the states.
 */
export function ProductCard({ name, price, image, cta }: ProductCardProps) {
  return (
    <article className="flex h-full flex-col rounded-card bg-surface p-6 shadow-card">
      <div className="relative h-product-media overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 48rem) 45vw, 90vw"
          // The vial is shown larger than its square canvas, as in the design.
          className="scale-[1.45] object-contain"
        />
      </div>
      <h3 className="mt-5 text-product-title font-medium text-heading lg:mt-8">
        {name}
      </h3>
      <div className="mt-4 flex flex-col gap-3 border-t border-sage-200 pt-3 lg:mt-8 lg:flex-row lg:items-center lg:justify-between lg:pt-6">
        <Price
          amountMinor={price.amountMinor}
          currency={price.currency}
          interval={price.interval}
          size="sm"
        />
        {cta ? (
          <CtaButton cta={cta} size="md" withArrow fullWidth="belowLg" />
        ) : null}
      </div>
    </article>
  );
}
