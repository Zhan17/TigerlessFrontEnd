import { describe, expect, it } from "vitest";
import {
  type BmiInput,
  calculateBmi,
  categorize,
  convertInput,
  gaugeFraction,
  scalePosition,
  validate,
} from "./bmi";

const imperial = (ft: string, inch: string, lb: string): BmiInput => ({
  unit: "imperial",
  heightFt: ft,
  heightIn: inch,
  heightCm: "",
  weight: lb,
});
const metric = (cm: string, kg: string): BmiInput => ({
  unit: "metric",
  heightFt: "",
  heightIn: "",
  heightCm: cm,
  weight: kg,
});

describe("calculateBmi", () => {
  it("computes metric BMI to one decimal", () => {
    expect(calculateBmi(metric("170", "70"))).toBe(24.2);
  });

  it("computes imperial BMI via inches", () => {
    // 5 ft 7 in, 150 lb -> 23.5
    expect(calculateBmi(imperial("5", "7", "150"))).toBe(23.5);
  });

  it("treats empty inches as zero", () => {
    expect(calculateBmi(imperial("6", "", "180"))).toBe(24.4);
  });

  it("returns null for invalid input", () => {
    expect(calculateBmi(metric("", "70"))).toBeNull();
    expect(calculateBmi(metric("40", "70"))).toBeNull();
  });
});

describe("categorize", () => {
  it.each([
    [18.4, "underweight"],
    [18.5, "healthy"],
    [24.9, "healthy"],
    [25, "overweight"],
    [29.9, "overweight"],
    [30, "obese"],
  ] as const)("BMI %s is %s", (bmi, category) => {
    expect(categorize(bmi)).toBe(category);
  });
});

describe("validate", () => {
  it("requires height and weight but not inches", () => {
    expect(validate(imperial("", "", ""))).toEqual({
      heightFt: "required",
      weight: "required",
    });
    expect(validate(imperial("5", "", "150"))).toEqual({});
  });

  it("flags out-of-range and non-numeric values", () => {
    expect(validate(imperial("5", "12", "150")).heightIn).toBe("range");
    expect(validate(metric("170", "5")).weight).toBe("range");
    expect(validate(metric("abc", "70")).heightCm).toBe("required");
  });
});

describe("convertInput", () => {
  it("converts imperial to metric", () => {
    expect(convertInput(imperial("5", "7", "150"), "metric")).toMatchObject({
      unit: "metric",
      heightCm: "170",
      weight: "68",
    });
  });

  it("converts metric to imperial with inches below 12", () => {
    expect(convertInput(metric("183", "80"), "imperial")).toMatchObject({
      unit: "imperial",
      heightFt: "6",
      heightIn: "0",
      weight: "176",
    });
  });

  it("keeps empty fields empty", () => {
    expect(convertInput(imperial("", "", "150"), "metric")).toMatchObject({
      heightCm: "",
      weight: "68",
    });
  });

  it("round-trips to a similar BMI", () => {
    const start = imperial("5", "7", "150");
    const there = convertInput(start, "metric");
    expect(
      Math.abs((calculateBmi(there) ?? 0) - (calculateBmi(start) ?? 0)),
    ).toBeLessThan(0.3);
  });
});

describe("scale and gauge positions", () => {
  it("puts category boundaries on the quarter marks", () => {
    expect(scalePosition(18.5)).toBeCloseTo(0.25);
    expect(scalePosition(25)).toBeCloseTo(0.5);
    expect(scalePosition(30)).toBeCloseTo(0.75);
  });

  it("clamps extremes", () => {
    expect(scalePosition(5)).toBe(0);
    expect(scalePosition(80)).toBe(1);
    expect(gaugeFraction(5)).toBe(0);
    expect(gaugeFraction(56)).toBe(1);
  });
});
