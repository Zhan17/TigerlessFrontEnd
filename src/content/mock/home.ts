import type { HomeContent } from "../schemas";

const none = { type: "none" } as const;

export const homeContent: HomeContent = {
  schemaVersion: 1,
  // Shared button labels, defined once (no destinations yet: Q1 / C3).
  ctas: {
    getStarted: { label: "Get started", link: none },
    login: { label: "Login", link: none },
    // F11: hero and closing CTA unified on the singular wording.
    startConsultation: { label: "Start a free consultation", link: none },
    seePlans: { label: "See plans", link: none },
  },
  navigation: {
    items: [
      { kind: "program", programId: "weight-loss" },
      { kind: "program", programId: "birth-control" },
      { kind: "program", programId: "sleep" },
      { kind: "link", label: "Contact Us", link: none },
    ],
    ctaRefs: ["getStarted", "login"],
  },
  hero: {
    badges: [
      { id: "languages", icon: "globe-earth", label: "40+ Languages" },
      {
        id: "physicians",
        icon: "stethoscope",
        label: "US-licensed physicians",
      },
      { id: "shipping", icon: "truck", label: "Free expedited shipping" },
    ],
    headline: [
      { text: "Healthcare that " },
      { text: "speaks your language.", emphasis: true },
    ],
    subtitle: [
      "Care in the language you think in.",
      "US-licensed physicians, AI translates your consultation.",
    ],
    ctaRef: "startConsultation",
    // K16: multi-select, zh + pt highlighted by default as in the design.
    highlightedLanguages: ["zh", "pt"],
    categories: {
      programIds: ["weight-loss", "birth-control", "sleep"],
      ctaRef: "seePlans",
    },
  },
  trustStrip: {
    items: [
      { id: "states", icon: "map-location", label: "50 States" },
      { id: "discreet", icon: "truck", label: "Discreet Shipping" },
      // F01: "No Issuance Needed" -> "No Insurance Needed".
      {
        id: "cash-pay",
        icon: "payment-success",
        label: "Cash-pay, No Insurance Needed",
      },
      {
        id: "assistant",
        icon: "customer-support",
        label: "24/7 AI Care Assistant",
      },
      {
        id: "board-certified",
        icon: "stethoscope",
        label: "US Board Certified MDs",
      },
    ],
  },
  howItWorks: {
    eyebrow: "How it works",
    heading: [{ text: "Real physicians, AI-amplified." }],
    subtitle: "Two layers working together — each doing what they do best.",
    steps: [
      {
        id: "physicians",
        title: "Human physicians",
        description:
          "They handle diagnosis, prescriptions, and every moment that calls for clinical judgment.",
        points: [
          "Diagnosis and treatment decisions.",
          "Prescriptions.",
          "Complex symptom evaluation.",
        ],
      },
      {
        id: "assistant",
        title: "AI care assistant",
        description:
          "It handles language and instant response — so nothing is lost in communication.",
        points: [
          "Real-time translation in every message.",
          "Answers around the clock.",
        ],
      },
    ],
    footnote:
      "The AI handles the language. Your physician makes the medical decisions.",
  },
  programs: {
    programIds: ["weight-loss", "birth-control", "sleep"],
    productCtaRef: "getStarted",
  },
  eligibility: {
    programId: "weight-loss",
    eyebrow: "Check your eligibility",
    tag: "BMI",
    heading: "Could a GLP-1 program be right for you?",
    helper: "Enter your height and weight below",
    optionsCta: { label: "See your GLP-1 Options", link: none },
  },
  onlineCare: {
    heading: [{ text: "Completely online on your schedule" }],
    serviceIds: [
      "provider-support",
      "treatment-management",
      "fda-approved-options",
      "expedited-shipping",
    ],
  },
  stories: {
    heading: [{ text: "Our " }, { text: "Success Stories", emphasis: true }],
    subtitle: "Care that finally made sense.",
    testimonialIds: ["maria-r", "david-l", "an-n"],
  },
  faq: {
    eyebrow: "FAQs",
    heading: [{ text: "Frequently Asked Questions" }],
    subtitle:
      "Have more questions? Our care team is here to help in your language.",
    faqIds: ["states", "languages", "insurance", "compounded-medication"],
  },
  closingCta: {
    heading: [{ text: "Ready For Healthcare In Your Language?" }],
    points: ["No Appointment Needed", "No Insurance Required"],
    ctaRef: "startConsultation",
  },
  footer: {
    tagline: "American medicine, in the language you think in.",
    columns: [
      {
        id: "products",
        title: "Products",
        items: [
          { kind: "program", programId: "weight-loss" },
          { kind: "program", programId: "birth-control" },
          { kind: "program", programId: "sleep" },
        ],
      },
      {
        id: "company",
        // F02: "Comapny" -> "Company".
        title: "Company",
        items: [
          { kind: "link", label: "About Apsu", link: none },
          { kind: "link", label: "Blogs", link: none },
          {
            kind: "link",
            label: "FAQs",
            link: { type: "anchor", target: "faq" },
          },
          { kind: "link", label: "Contact Us", link: none },
        ],
      },
      {
        id: "legal",
        title: "Legal",
        items: [
          { kind: "link", label: "Terms", link: none },
          { kind: "link", label: "Privacy Policy", link: none },
          { kind: "link", label: "Medication Safety Information", link: none },
        ],
      },
    ],
    disclaimer: [
      "The information on this site is for general educational purposes and is not medical advice. Apsu is a technology platform; medical care is provided by independent, licensed providers, and pharmacy services by licensed pharmacies, who decide whether treatment is appropriate. Payment does not guarantee a prescription. Apsu offers compounded GLP-1 medication, which is prepared by licensed U.S. compounding pharmacies and is not approved or evaluated by the FDA. Apsu does not manufacture medication, and product appearance may differ from images shown. Results vary and are not guaranteed. If this is an emergency, call 911.",
    ],
    terms: [
      { text: "By using our services, you agree to our " },
      { text: "Terms & Conditions", link: none },
      { text: "." },
    ],
    socials: [
      { platform: "x", url: "https://x.com" },
      { platform: "facebook", url: "https://www.facebook.com" },
      { platform: "instagram", url: "https://www.instagram.com" },
      { platform: "linkedin", url: "https://www.linkedin.com" },
    ],
    copyrightHolder: "APSU",
  },
};
