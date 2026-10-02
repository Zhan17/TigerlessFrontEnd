import type { SocialProfile, Testimonial } from "../schemas";
import { images } from "./images";

// Placeholder profile targets: the platforms' official sites (decision Q5).
const socials: SocialProfile[] = [
  { platform: "x", url: "https://x.com" },
  { platform: "instagram", url: "https://www.instagram.com" },
  { platform: "linkedin", url: "https://www.linkedin.com" },
];

export const testimonials: Testimonial[] = [
  {
    kind: "quote",
    id: "maria-r",
    programId: "weight-loss",
    rating: 5,
    quote:
      "I described my symptoms in my own language and actually felt understood, no translating in my head.",
    author: { name: "Maria R.", location: "Houston, TX", socials },
  },
  {
    kind: "photo",
    id: "david-l",
    photo: images.successStory,
    // F07: missing full stop added ("David L" -> "David L.").
    author: { name: "David L.", location: "Queens, NY", socials },
  },
  {
    kind: "quote",
    id: "an-n",
    programId: "sleep",
    rating: 5,
    quote:
      "Private, simple, and in my language the whole way through. It made getting care feel normal again.",
    author: { name: "An N.", location: "San Jose, CA", socials },
  },
];
