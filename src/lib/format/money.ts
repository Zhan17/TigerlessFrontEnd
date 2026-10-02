/**
 * Format an amount stored in the currency's minor units with Intl, so the
 * symbol, separators and number of decimals come from the locale and the
 * currency instead of being hard-coded: USD has 2 decimals (cents), JPY 0
 * (yen), KWD 3 (fils). Whole amounts drop the decimals ($200), others keep
 * them ($19.99). An unknown currency code throws instead of showing a
 * wrong amount.
 */
export function formatMoney(
  amountMinor: number,
  currency: string,
  locale = "en-US",
): string {
  if (!Number.isInteger(amountMinor)) {
    throw new RangeError(`amountMinor must be an integer, got ${amountMinor}`);
  }
  const digits = minorDigits(currency);
  const perUnit = 10 ** digits;
  const whole = amountMinor % perUnit === 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: whole ? 0 : digits,
    maximumFractionDigits: whole ? 0 : digits,
  }).format(amountMinor / perUnit);
}

/** Decimal places of a currency's minor unit (ISO 4217, via Intl). */
function minorDigits(currency: string): number {
  return (
    new Intl.NumberFormat("en", {
      style: "currency",
      currency,
    }).resolvedOptions().maximumFractionDigits ?? 2
  );
}
