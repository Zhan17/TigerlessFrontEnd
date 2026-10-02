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

  it("rejects non-integer minor units", () => {
    expect(() => formatMoney(19.5, "USD")).toThrow(RangeError);
  });
});
