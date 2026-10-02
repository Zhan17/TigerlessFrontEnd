import { describe, expect, it } from "vitest";
import { formatMoney } from "./money";

describe("formatMoney", () => {
  it("drops decimals for whole amounts", () => {
    expect(formatMoney(20000, "USD")).toBe("$200");
    expect(formatMoney(2000, "USD")).toBe("$20");
  });

  it("keeps two decimals otherwise", () => {
    expect(formatMoney(1999, "USD")).toBe("$19.99");
  });

  it("takes the symbol from the currency and locale", () => {
    expect(formatMoney(20000, "EUR", "en-US")).toBe("€200");
    expect(formatMoney(123456, "USD")).toBe("$1,234.56");
  });

  it("uses each currency's own minor unit (R09)", () => {
    // JPY has no decimals: 2000 minor units are ¥2,000, not ¥20.
    expect(formatMoney(2000, "JPY")).toBe("¥2,000");
    // KWD has three: 1999 fils are 1.999 dinars.
    expect(formatMoney(1999, "KWD")).toMatch(/^KWD\s1\.999$/);
    expect(formatMoney(5000, "KWD")).toMatch(/^KWD\s5$/);
  });

  it("rejects an unknown currency code instead of guessing", () => {
    expect(() => formatMoney(100, "XYZ1")).toThrow(RangeError);
  });

  it("rejects non-integer minor units", () => {
    expect(() => formatMoney(19.5, "USD")).toThrow(RangeError);
  });
});
