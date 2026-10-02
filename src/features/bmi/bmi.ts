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

/**
 * Accepted measurements (plausible adults), defined once in metric so both
 * unit systems accept exactly the same people: a valid value stays valid
 * after a unit switch (R07).
 */
export const MEASUREMENT_LIMITS = {
  heightCm: [90, 250],
  weightKg: [20, 320],
} as const;

/** Round to a step like 0.1 without float noise (2.4, not 2.4000000000000004). */
const roundTo = (n: number, step: number) => {
  const perUnit = Math.round(1 / step);
  return Math.round(n * perUnit) / perUnit;
};

/**
 * Field bounds shown to the user (messages, stepper limits): the metric
 * limits converted and rounded inwards, so every value inside a field's
 * bounds is accepted.
 */
export const LIMITS = {
  metric: {
    heightCm: MEASUREMENT_LIMITS.heightCm,
    weightKg: MEASUREMENT_LIMITS.weightKg,
  },
  imperial: {
    heightFt: [2, 8],
    heightIn: [0, 11],
    /** Total height as [ft, in] pairs, e.g. 2 ft 11.5 in – 8 ft 2.4 in. */
    height: [
      splitFeet(Math.ceil((90 / CM_PER_INCH) * 10) / 10),
      splitFeet(Math.floor((250 / CM_PER_INCH) * 10) / 10),
    ],
    weightLb: [
      Math.ceil((20 / KG_PER_LB) * 10) / 10,
      Math.floor((320 / KG_PER_LB) * 10) / 10,
    ],
  },
} as const;

function splitFeet(totalInches: number): readonly [number, number] {
  const ft = Math.floor(totalInches / 12);
  return [ft, roundTo(totalInches - ft * 12, 0.1)];
}

/** Exact measurement carried across a unit switch (metric). */
export type ExactMeasurement = { cm: number | null; kg: number | null };

export type BmiInput = {
  unit: UnitSystem;
  /** Raw field values (strings, as typed or as displayed after a switch). */
  heightFt: string;
  heightIn: string;
  heightCm: string;
  weight: string;
  /**
   * The exact measurement behind the displayed fields after a unit switch
   * (the fields show rounded values). It is what gets validated and
   * calculated, so switching units never changes the measurement, the BMI
   * or its category (R03). Editing a field drops its part (see
   * `withoutExact`).
   */
  exact?: ExactMeasurement;
};

export type FieldName = "heightFt" | "heightIn" | "heightCm" | "weight";
export type FieldError = "required" | "range";

const parse = (value: string): number | null => {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

/** Small tolerance for values that only differ by float noise. */
const EPSILON = 1e-9;
const inRange = (n: number, [min, max]: readonly [number, number]) =>
  n >= min - EPSILON && n <= max + EPSILON;

/** Height and weight from the typed fields (null where missing). */
function typedMeasurement(input: BmiInput): ExactMeasurement {
  const weight = parse(input.weight);
  if (input.unit === "metric") {
    return { cm: parse(input.heightCm), kg: weight };
  }
  const ft = parse(input.heightFt);
  const inch = parse(input.heightIn) ?? 0;
  return {
    cm: ft === null ? null : (ft * 12 + inch) * CM_PER_INCH,
    kg: weight === null ? null : weight * KG_PER_LB,
  };
}

/** The measurement to use: exact parts where carried, typed otherwise. */
export function measurement(input: BmiInput): ExactMeasurement {
  const typed = typedMeasurement(input);
  return {
    cm: input.exact?.cm ?? typed.cm,
    kg: input.exact?.kg ?? typed.kg,
  };
}

/** A field edit replaces that part of the exact measurement. */
export function withoutExact(input: BmiInput, field: FieldName): BmiInput {
  if (!input.exact) return input;
  const exact =
    field === "weight"
      ? { ...input.exact, kg: null }
      : { ...input.exact, cm: null };
  return { ...input, exact };
}

/**
 * Validation. Required fields must hold numbers; inches stay within a foot;
 * height and weight are checked as one metric measurement, so both unit
 * systems accept the same range (R07).
 */
export function validate(
  input: BmiInput,
): Partial<Record<FieldName, FieldError>> {
  const errors: Partial<Record<FieldName, FieldError>> = {};
  const heightField: FieldName =
    input.unit === "metric" ? "heightCm" : "heightFt";

  if (parse(input[heightField]) === null) errors[heightField] = "required";
  if (parse(input.weight) === null) errors.weight = "required";
  if (input.unit === "imperial" && input.heightIn.trim() !== "") {
    const inch = parse(input.heightIn);
    if (inch === null) errors.heightIn = "required";
    else if (inch < 0 || inch >= 12) errors.heightIn = "range";
  }

  const { cm, kg } = measurement(input);
  if (!errors[heightField] && !errors.heightIn && cm !== null) {
    if (!inRange(cm, MEASUREMENT_LIMITS.heightCm))
      errors[heightField] = "range";
  }
  if (!errors.weight && kg !== null) {
    if (!inRange(kg, MEASUREMENT_LIMITS.weightKg)) errors.weight = "range";
  }
  return errors;
}

/** Height in cm and weight in kg, or null when the input is not valid. */
export function toMetric(input: BmiInput): { cm: number; kg: number } | null {
  if (Object.keys(validate(input)).length > 0) return null;
  const { cm, kg } = measurement(input);
  return cm === null || kg === null ? null : { cm, kg };
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

/** One decimal, without a trailing ".0". */
const display = (n: number) =>
  String(roundTo(n, 0.1).toFixed(1)).replace(/\.0$/, "");

/**
 * Convert the values when the unit system changes (decision: keep the
 * user's numbers instead of clearing them). The fields show rounded values
 * (cm / kg / lbs to 0.1, whole inches), while the exact measurement is
 * carried in `exact`, so any number of switches back and forth keeps the
 * same measurement, BMI and category (R03). Empty fields stay empty.
 */
export function convertInput(input: BmiInput, to: UnitSystem): BmiInput {
  if (input.unit === to) return input;
  const exact = measurement(input);

  if (to === "metric") {
    return {
      unit: "metric",
      heightFt: "",
      heightIn: "",
      heightCm: exact.cm === null ? "" : display(exact.cm),
      weight: exact.kg === null ? "" : display(exact.kg),
      exact,
    };
  }

  let ft = "";
  let inch = "";
  if (exact.cm !== null) {
    const totalIn = Math.round(exact.cm / CM_PER_INCH);
    ft = String(Math.floor(totalIn / 12));
    inch = String(totalIn % 12);
  }
  return {
    unit: "imperial",
    heightFt: ft,
    heightIn: inch,
    heightCm: "",
    weight: exact.kg === null ? "" : display(exact.kg / KG_PER_LB),
    exact,
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
