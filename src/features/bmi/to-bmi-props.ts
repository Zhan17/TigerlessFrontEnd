import type { HomeContent } from "@/content/schemas";
import type { BmiCalculatorProps } from "./BmiCalculator";

/** API content -> BMI calculator copy (rules and field labels live in code). */
export function toBmiProps(
  home: HomeContent,
): BmiCalculatorProps & { programId: string } {
  const { programId, eyebrow, tag, heading, helper, optionsCta } =
    home.eligibility;
  return { programId, eyebrow, tag, heading, helper, optionsCta };
}
