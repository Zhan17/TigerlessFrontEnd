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
  rating: {
    label: (value: number, max: number) => `Rated ${value} out of ${max}`,
  },
} as const;

export type BillingInterval = keyof typeof uiCopy.price.perInterval;
