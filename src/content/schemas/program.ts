import { z } from "zod";
import { Cta, Id, Image, RecurringPrice, RichText } from "./common";

/**
 * GET /programs — the care programs (weight loss, birth control, sleep).
 *
 * A program is the single source for its name and copy: navigation, the
 * footer, hero category cards and testimonials reference it by id instead of
 * repeating the text.
 */

/** Decorative stat card over the program image (sleep section). */
export const HighlightCard = z.discriminatedUnion("kind", [
  /** "Olivia Gomes — 78 Normal · 89.5% Progress" */
  z.object({
    kind: z.literal("metrics"),
    id: Id,
    title: z.string().min(1),
    metrics: z
      .array(z.object({ value: z.string().min(1), label: z.string().min(1) }))
      .min(1),
  }),
  /** "Your profile — 82%" with a progress bar. */
  z.object({
    kind: z.literal("progress"),
    id: Id,
    title: z.string().min(1),
    /** 0–100 */
    percent: z.number().min(0).max(100),
  }),
]);

export const Program = z.object({
  id: Id,
  /**
   * Drives the front-end theme (mint / purple / blue). Open set: unknown
   * categories render with the default theme.
   */
  category: z.string().min(1),
  /** Short name used in nav, footer and as the section eyebrow: "Weight Loss". */
  name: z.string().min(1),
  /** Summary card in the hero. */
  card: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    image: Image,
  }),
  /** Full section further down the page. */
  section: z.object({
    /** Show `name` as an eyebrow above the heading (only weight loss does). */
    showEyebrow: z.boolean(),
    heading: RichText,
    /** Paragraphs under the heading. */
    intro: z.array(z.string().min(1)),
    points: z.array(z.string().min(1)),
    /** Shown as "From $20/mo"; omitted when products carry the prices. */
    startingPrice: RecurringPrice.optional(),
    cta: Cta,
    image: Image,
    highlights: z.array(HighlightCard).optional(),
  }),
});

export const ProgramList = z.array(Program);

export type HighlightCard = z.infer<typeof HighlightCard>;
export type Program = z.infer<typeof Program>;
