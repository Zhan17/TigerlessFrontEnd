import { describe, expect, it } from "vitest";
import {
  type BmiInput,
  calculateBmi,
  categorize,
  convertInput,
  gaugeFraction,
  LIMITS,
  scalePosition,
  validate,
  withoutExact,
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
  it("converts imperial to metric, showing 0.1 precision", () => {
    expect(convertInput(imperial("5", "7", "150"), "metric")).toMatchObject({
      unit: "metric",
      heightCm: "170.2",
      weight: "68",
    });
  });

  it("converts metric to imperial with inches below 12", () => {
    expect(convertInput(metric("183", "80"), "imperial")).toMatchObject({
      unit: "imperial",
      heightFt: "6",
      heightIn: "0",
      weight: "176.4",
    });
  });

  it("keeps empty fields empty", () => {
    expect(convertInput(imperial("", "", "150"), "metric")).toMatchObject({
      heightCm: "",
      weight: "68",
    });
  });
});

/*
 * R03 / R10: only the unit changes, so the measurement, the BMI and its
 * category must not. 177 cm / 78.4 kg sits right on the 25.0 boundary:
 * the old rounding-based conversion turned it into 24.8 then 24.6.
 */
describe("unit switches keep the measurement", () => {
  const switchUnits = (input: BmiInput, times: number) => {
    let current = input;
    for (let i = 0; i < times; i++) {
      current = convertInput(
        current,
        current.unit === "metric" ? "imperial" : "metric",
      );
    }
    return current;
  };

  it.each([
    ["177 cm / 78.4 kg (on the 25.0 boundary)", metric("177", "78.4")],
    ["170 cm / 53.4 kg (near 18.5)", metric("170", "53.4")],
    ["5 ft 7 in / 150 lb", imperial("5", "7", "150")],
    ["6 ft 2 in / 233.5 lb (near 30)", imperial("6", "2", "233.5")],
  ])("%s: same BMI and category over many round trips", (_, start) => {
    const bmi = calculateBmi(start);
    expect(bmi).not.toBeNull();
    for (const times of [1, 2, 3, 10]) {
      const after = calculateBmi(switchUnits(start, times));
      expect(after).toBe(bmi);
      expect(categorize(after ?? 0)).toBe(categorize(bmi ?? 0));
    }
  });

  it("returns to the exact typed values after a round trip", () => {
    expect(switchUnits(metric("177", "78.4"), 2)).toMatchObject({
      heightCm: "177",
      weight: "78.4",
    });
    expect(switchUnits(imperial("5", "7", "150"), 2)).toMatchObject({
      heightFt: "5",
      heightIn: "7",
      weight: "150",
    });
  });

  it("uses a newly typed value instead of the carried exact one", () => {
    const switched = convertInput(metric("177", "78.4"), "imperial");
    const edited = { ...withoutExact(switched, "weight"), weight: "200" };
    // 177 cm (exact, unchanged) and 200 lb.
    expect(calculateBmi(edited)).toBe(29);
  });
});

/*
 * R07: both unit systems accept the same measurements, so a valid value
 * stays valid (and an invalid one invalid) after a switch.
 */
describe("validity does not depend on the unit", () => {
  const valid = (input: BmiInput) => Object.keys(validate(input)).length === 0;

  it.each([
    ["90 cm / 20 kg (lower bounds)", metric("90", "20"), true],
    ["250 cm / 320 kg (upper bounds)", metric("250", "320"), true],
    ["180 cm / 320 kg", metric("180", "320"), true],
    ["89.9 cm / 70 kg", metric("89.9", "70"), false],
    ["180 cm / 320.1 kg", metric("180", "320.1"), false],
    ["8 ft 11 in / 150 lb (272 cm)", imperial("8", "11", "150"), false],
    ["2 ft 11.5 in / 44.1 lb", imperial("2", "11.5", "44.1"), true],
    ["8 ft 2.4 in / 705.4 lb", imperial("8", "2.4", "705.4"), true],
  ])("%s", (_, input, expected) => {
    expect(valid(input)).toBe(expected);
    const other = input.unit === "metric" ? "imperial" : "metric";
    const switched = convertInput(input, other);
    expect(valid(switched)).toBe(expected);
    expect(calculateBmi(switched)).toBe(calculateBmi(input));
  });

  it("shows clean field bounds derived from the metric limits", () => {
    expect(LIMITS.imperial.height).toEqual([
      [2, 11.5],
      [8, 2.4],
    ]);
    expect(LIMITS.imperial.weightLb).toEqual([44.1, 705.4]);
  });

  it("still flags inches of a foot or more and missing values", () => {
    expect(validate(imperial("5", "12", "150")).heightIn).toBe("range");
    expect(validate(imperial("", "", ""))).toEqual({
      heightFt: "required",
      weight: "required",
    });
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
