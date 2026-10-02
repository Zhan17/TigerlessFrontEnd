/**
 * Format an amount stored in the currency's minor units with Intl, so the
 * symbol, separators and number of decimals come from the locale and the
 * currency instead of being hard-coded: USD has 2 decimals (cents), JPY 0
 * (yen), KWD 3 (fils). Whole amounts drop the decimals ($200), others keep
 * them ($19.99). An unknown currency code throws instead of showing a
 * wrong amount (Intl alone would accept a well-formed unknown code such as
 * "ZZZ" and guess two decimals, R12).
 */
export function formatMoney(
  amountMinor: number,
  currency: string,
  locale = "en-US",
): string {
  if (!Number.isInteger(amountMinor)) {
    throw new RangeError(`amountMinor must be an integer, got ${amountMinor}`);
  }
  if (!isSupportedCurrency(currency)) {
    throw new RangeError(`Unsupported currency code: ${currency}`);
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

/**
 * Whether Intl knows this ISO 4217 code. Used by the formatter and by the
 * content schema, so unknown codes are rejected at the data boundary.
 * Environments without `Intl.supportedValuesOf` accept any well-formed
 * code (formatting still works there).
 */
export function isSupportedCurrency(code: string): boolean {
  if (!/^[A-Z]{3}$/.test(code)) return false;
  if (typeof Intl.supportedValuesOf !== "function") return true;
  return supportedCurrencies().has(code);
}

let supported: Set<string> | null = null;
function supportedCurrencies(): Set<string> {
  supported ??= new Set(Intl.supportedValuesOf("currency"));
  return supported;
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
