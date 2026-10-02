import type { Program } from "../schemas";
import { images } from "./images";

const none = { type: "none" } as const;

export const programs: Program[] = [
  {
    id: "weight-loss",
    category: "weight-loss",
    name: "Weight Loss",
    card: {
      eyebrow: "Weight management",
      title: "Compounded GLP-1 Semaglutide & Tirzepatide",
      image: images.vialHero,
    },
    section: {
      showEyebrow: true,
      // F03: "Loss Weight" -> "Lose Weight" (design casing kept).
      heading: [{ text: "Lose Weight In Your Way." }],
      intro: [],
      points: [
        "Same-day doctor visits and prescriptions",
        "Dosage personalized",
        "Shipped from licensed USA pharmacies",
      ],
      cta: { label: "See plans", link: none },
      image: images.weightLoss,
    },
  },
  {
    id: "birth-control",
    category: "birth-control",
    name: "Birth Control",
    card: {
      eyebrow: "Birth control",
      title: "Prescription birth control, delivered discreetly",
      // Placeholder image from the design (noted, not changed: Q4).
      image: images.vialHero,
    },
    section: {
      showEyebrow: false,
      heading: [{ text: "Birth control, without the waiting room." }],
      intro: [
        "Choose the method that fits your life. A US-licensed physician prescribes online, and your refills arrive automatically.",
      ],
      points: [
        "Prescribed online, delivered to your door",
        "Automatic refills, delivered",
        "Plain, discreet packaging",
      ],
      startingPrice: { amountMinor: 2000, currency: "USD", interval: "month" },
      cta: { label: "Start your birth control consult", link: none },
      image: images.birthControl,
    },
  },
  {
    id: "sleep",
    category: "sleep",
    name: "Sleep",
    card: {
      eyebrow: "Sleep",
      title: "Non-habit-forming formulations for sensitive sleepers",
      image: images.vialHero,
    },
    section: {
      showEyebrow: false,
      heading: [{ text: "Sleep" }],
      intro: [
        "Real rest without the dependency.",
        // F04: capitalisation and punctuation fixed.
        "Non-habit-forming, physician-prescribed, for sensitive sleepers.",
      ],
      points: [
        "Non-controlled, non-habit-forming options",
        "Matched to your sleep pattern by a physician",
        "No controlled sedatives",
        "Cash-pay, no insurance needed",
      ],
      startingPrice: { amountMinor: 2000, currency: "USD", interval: "month" },
      cta: { label: "Start your sleep consult", link: none },
      image: images.sleep,
      highlights: [
        {
          kind: "metrics",
          id: "sleep-score",
          title: "Olivia Gomes",
          metrics: [
            { value: "78", label: "Normal" },
            { value: "89.5%", label: "Progress" },
          ],
        },
        { kind: "progress", id: "profile", title: "Your profile", percent: 82 },
      ],
    },
  },
];
