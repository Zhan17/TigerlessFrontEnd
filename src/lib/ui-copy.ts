/**
 * Fixed interface copy that is not content (labels, units, accessible
 * names). Content comes from the data layer; this dictionary is the single
 * place to swap for an i18n catalogue later. English only for now.
 */
export const uiCopy = {
  price: {
    from: "From",
    perInterval: { week: "/wk", month: "/mo", year: "/yr" },
  },
  nav: { label: "Main", home: "Apsu home" },
  menu: { open: "Open menu", close: "Close menu", title: "Menu" },
  hero: { languages: "Languages available for your consultation" },
  trustStrip: { label: "Why patients choose Apsu" },
  carousel: {
    roleDescription: "carousel",
    slideRoleDescription: "slide",
    previous: "Previous",
    next: "Next",
    slide: (index: number, total: number) => `${index} of ${total}`,
  },
  bmi: {
    units: { label: "Units", imperial: "ft / lbs", metric: "cm / kg" },
    height: "Height",
    weight: "Weight",
    sex: "Sex",
    sexes: { female: "Female", male: "Male" },
    unitSuffix: { ft: "ft", in: "in", lbs: "lbs", cm: "cm", kg: "kg" },
    fieldLabels: {
      heightFt: "Height, feet",
      heightIn: "Height, inches",
      heightCm: "Height, centimetres",
      weightLb: "Weight, pounds",
      weightKg: "Weight, kilograms",
    },
    increase: (field: string) => `Increase ${field.toLowerCase()}`,
    decrease: (field: string) => `Decrease ${field.toLowerCase()}`,
    range: (min: number, max: number, unit: string) =>
      `Enter ${min}–${max} ${unit}`,
    submit: "Calculate BMI",
    scoreLabel: "Your BMI Score",
    scoreLabelShort: "Your Score",
    empty: "Enter your details to see your score",
    categories: {
      underweight: "Underweight",
      healthy: "Healthy Weight",
      overweight: "Overweight",
      obese: "Obese",
    },
    // C6: the result names the selected sex; the number does not depend on it.
    result: (sex: "female" | "male", bmi: string, category: string) =>
      `As a ${sex === "female" ? "woman" : "man"}, your BMI is ${bmi} — ${category}.`,
  },
  rating: {
    label: (value: number, max: number) => `Rated ${value} out of ${max}`,
  },
} as const;

export type BillingInterval = keyof typeof uiCopy.price.perInterval;
