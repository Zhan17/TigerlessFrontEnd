import type { Image } from "../schemas";

/** Local images in public/images with their intrinsic sizes. */
export const images = {
  vialHero: {
    src: "/images/vial-hero.webp",
    alt: "Multi-dose medication vial",
    width: 800,
    height: 800,
  },
  vialProduct: {
    src: "/images/vial-product.webp",
    alt: "Compounded GLP-1 medication vial",
    width: 800,
    height: 800,
  },
  weightLoss: {
    src: "/images/weight-loss-woman.webp",
    alt: "Smiling patient in an orange tank top",
    width: 1185,
    height: 1327,
  },
  birthControl: {
    src: "/images/birth-control-woman.webp",
    alt: "Smiling patient in a green sweater",
    width: 810,
    height: 1499,
  },
  sleep: {
    src: "/images/sleep-woman.webp",
    alt: "Patient sitting cross-legged with eyes closed, relaxed",
    width: 1200,
    height: 1533,
  },
  phoneMockup: {
    src: "/images/phone-mockup.webp",
    alt: "Phone showing a video consultation with a physician",
    width: 271,
    height: 553,
  },
  providerAvatar: {
    src: "/images/provider-avatar.webp",
    alt: "",
    width: 112,
    height: 112,
  },
  clinicians: {
    src: "/images/clinicians.webp",
    alt: "Clinicians reviewing a treatment plan together",
    width: 2000,
    height: 1125,
  },
  wegovyPens: {
    src: "/images/wegovy-pens.webp",
    alt: "Medication injection pens",
    width: 628,
    height: 406,
  },
  delivery: {
    src: "/images/delivery.webp",
    alt: "Courier delivering a package",
    width: 933,
    height: 1400,
  },
  successStory: {
    src: "/images/success-story.webp",
    alt: "Portrait of a patient smiling",
    width: 1400,
    height: 933,
  },
} satisfies Record<string, Image>;
