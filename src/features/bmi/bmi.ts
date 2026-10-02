/**
 * BMI rules (decision 3.1: fixed in the front end). Pure functions only, so
 * they are unit-tested and could later be swapped for an API call without
 * touching the component.
 *
 * Adult BMI = kg / m². Categories (WHO adult ranges) are the same for women
 * and men; the sex field does not change the number (decision C6, K21).
 */

export type UnitSystem = "imperial" | "metric";
export type Sex = "male" | "female";

export type BmiCategory = "underweight" | "healthy" | "overweight" | "obese";

/** Lower bounds of each category, in order. */
export const BMI_THRESHOLDS: readonly { category: BmiCategory; min: number }[] =
  [
    { category: "underweight", min: 0 },
    { category: "healthy", min: 18.5 },
    { category: "overweight", min: 25 },
    { category: "obese", min: 30 },
  ];

const CM_PER_INCH = 2.54;
const KG_PER_LB = 0.45359237;

/** Accepted input ranges (plausible adult values). */
export const LIMITS = {
  metric: { heightCm: [90, 250], weightKg: [20, 320] },
  imperial: { heightFt: [3, 8], heightIn: [0, 11], weightLb: [45, 700] },
} as const;

export type BmiInput = {
  unit: UnitSystem;
  /** Raw field values (strings, as typed). */
  heightFt: string;
  heightIn: string;
  heightCm: string;
  weight: string;
};

export type FieldName = "heightFt" | "heightIn" | "heightCm" | "weight";
export type FieldError = "required" | "range";

const parse = (value: string): number | null => {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const inRange = (n: number, [min, max]: readonly [number, number]) =>
  n >= min && n <= max;

/** Per-field validation for the current unit system. */
export function validate(
  input: BmiInput,
): Partial<Record<FieldName, FieldError>> {
  const errors: Partial<Record<FieldName, FieldError>> = {};
  const check = (
    field: FieldName,
    range: readonly [number, number],
    required = true,
  ) => {
    const n = parse(input[field]);
    if (n === null) {
      if (required) errors[field] = "required";
    } else if (!inRange(n, range)) {
      errors[field] = "range";
    }
  };
  if (input.unit === "metric") {
    check("heightCm", LIMITS.metric.heightCm);
    check("weight", LIMITS.metric.weightKg);
  } else {
    check("heightFt", LIMITS.imperial.heightFt);
    // Inches may be left empty (= 0).
    check("heightIn", LIMITS.imperial.heightIn, false);
    check("weight", LIMITS.imperial.weightLb);
  }
  return errors;
}

/** Height in cm and weight in kg, or null when the input is not valid. */
export function toMetric(input: BmiInput): { cm: number; kg: number } | null {
  if (Object.keys(validate(input)).length > 0) return null;
  if (input.unit === "metric") {
    return { cm: Number(input.heightCm), kg: Number(input.weight) };
  }
  const inches = Number(input.heightFt) * 12 + (parse(input.heightIn) ?? 0);
  return { cm: inches * CM_PER_INCH, kg: Number(input.weight) * KG_PER_LB };
}

export function bmiFromMetric(cm: number, kg: number): number {
  const m = cm / 100;
  return kg / (m * m);
}

/** BMI rounded to one decimal, or null for invalid input. */
export function calculateBmi(input: BmiInput): number | null {
  const metric = toMetric(input);
  if (!metric) return null;
  return Math.round(bmiFromMetric(metric.cm, metric.kg) * 10) / 10;
}

export function categorize(bmi: number): BmiCategory {
  let result: BmiCategory = "underweight";
  for (const { category, min } of BMI_THRESHOLDS)
    if (bmi >= min) result = category;
  return result;
}

/**
 * Convert the typed values when the unit system changes (decision: keep
 * the user's numbers instead of clearing them). Empty fields stay empty.
 */
export function convertInput(input: BmiInput, to: UnitSystem): BmiInput {
  if (input.unit === to) return input;
  const height = parse(
    input.unit === "metric" ? input.heightCm : input.heightFt,
  );
  const weight = parse(input.weight);

  if (to === "metric") {
    const inches =
      height === null ? null : height * 12 + (parse(input.heightIn) ?? 0);
    return {
      unit: "metric",
      heightFt: "",
      heightIn: "",
      heightCm: inches === null ? "" : String(Math.round(inches * CM_PER_INCH)),
      weight: weight === null ? "" : String(Math.round(weight * KG_PER_LB)),
    };
  }

  let ft = "";
  let inch = "";
  if (height !== null) {
    const totalIn = Math.round(height / CM_PER_INCH);
    ft = String(Math.floor(totalIn / 12));
    inch = String(totalIn % 12);
  }
  return {
    unit: "imperial",
    heightFt: ft,
    heightIn: inch,
    heightCm: "",
    weight: weight === null ? "" : String(Math.round(weight / KG_PER_LB)),
  };
}

/**
 * Position (0–1) of a BMI on the scale bar. The four labels sit in equal
 * quarters, so each category maps onto its quarter.
 */
export function scalePosition(bmi: number): number {
  const segments: [number, number][] = [
    [12, 18.5],
    [18.5, 25],
    [25, 30],
    [30, 40],
  ];
  for (let i = 0; i < segments.length; i++) {
    const [lo, hi] = segments[i] ?? [0, 1];
    if (bmi < hi || i === segments.length - 1) {
      const t = Math.min(1, Math.max(0, (bmi - lo) / (hi - lo)));
      return (i + t) / segments.length;
    }
  }
  return 1;
}

/** Fraction (0–1) of the gauge ring to fill: BMI 12 -> 0, BMI 40 -> 1. */
export function gaugeFraction(bmi: number): number {
  return Math.min(1, Math.max(0, (bmi - 12) / (40 - 12)));
}
