import { z } from "zod";
import { Id, Image, SocialProfile } from "./common";

/**
 * GET /testimonials — "Our Success Stories". Two kinds: a written review
 * (category, stars, quote) and a photo card. The category label comes from
 * the referenced program's name.
 */

const Author = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  socials: z.array(SocialProfile),
});

export const Testimonial = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("quote"),
    id: Id,
    programId: Id,
    /** Whole stars, 1–5. */
    rating: z.number().int().min(1).max(5),
    quote: z.string().min(1),
    author: Author,
  }),
  z.object({
    kind: z.literal("photo"),
    id: Id,
    photo: Image,
    author: Author,
  }),
]);

export const TestimonialList = z.array(Testimonial);

export type Testimonial = z.infer<typeof Testimonial>;
