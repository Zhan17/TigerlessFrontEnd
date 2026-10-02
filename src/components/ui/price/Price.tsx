import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format/money";
import { type BillingInterval, uiCopy } from "@/lib/ui-copy";

export type PriceProps = {
  amountMinor: number;
  currency: string;
  interval: BillingInterval;
  /** lg = program sections (52), sm = product cards (40). */
  size?: "lg" | "sm";
  className?: string;
};

/** "From $200/mo". The amount is formatted with Intl from minor units. */
export function Price({
  amountMinor,
  currency,
  interval,
  size = "lg",
  className,
}: PriceProps) {
  const unit = size === "lg" ? "text-price-unit" : "text-price-sm-unit";
  const amount = size === "lg" ? "text-price" : "text-price-sm";
  return (
    <p className={cn("text-heading-strong", className)}>
      <span className={unit}>{uiCopy.price.from} </span>
      <span className={cn("font-medium", amount)}>
        {formatMoney(amountMinor, currency)}
      </span>
      <span className={unit}>{uiCopy.price.perInterval[interval]}</span>
    </p>
  );
}
