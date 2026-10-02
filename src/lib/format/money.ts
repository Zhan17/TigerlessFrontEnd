/**
 * Format an amount stored in minor units (cents) with Intl, so the currency
 * symbol and separators come from the locale instead of hard-coded "$".
 * Whole amounts drop the decimals ($200), others keep them ($19.99).
 */
export function formatMoney(
  amountMinor: number,
  currency: string,
  locale = "en-US",
): string {
  if (!Number.isInteger(amountMinor)) {
    throw new RangeError(`amountMinor must be an integer, got ${amountMinor}`);
  }
  const whole = amountMinor % 100 === 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(amountMinor / 100);
}
