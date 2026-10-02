import { z } from "zod";

/**
 * Shared building blocks of the API contract.
 *
 * Conventions (doc/architecture.md §2.5):
 * - Objects use z.object, which ignores unknown keys, so the backend can add
 *   fields without breaking the front end.
 * - Content only: no colours, layout or CSS. Presentation is derived on the
 *   front end (e.g. `category` -> theme).
 * - Stable string ids; references between resources use those ids.
 * - Open string sets (categories, icon keys) stay `string` so an unknown
 *   value falls back to a default instead of failing validation.
 */

/** Stable identifier (slug-like). */
export const Id = z.string().min(1);

/**
 * Where a control leads. `none` = no destination yet: the control only gives
 * press feedback (decisions Q1/Q2/C3).
 */
export const Link = z.discriminatedUnion("type", [
  /** Same-page section, e.g. "weight-loss" -> #weight-loss. */
  z.object({ type: z.literal("anchor"), target: Id }),
  /** In-app route for future pages, e.g. "/login". */
  z.object({ type: z.literal("route"), path: z.string().startsWith("/") }),
  z.object({ type: z.literal("external"), url: z.url() }),
  z.object({ type: z.literal("none") }),
]);

export const Cta = z.object({
  label: z.string().min(1),
  link: Link,
});

/** Text with optional emphasised (highlighted) runs and inline links. */
export const RichTextSegment = z.object({
  text: z.string(),
  emphasis: z.boolean().optional(),
  link: Link.optional(),
});
export const RichText = z.array(RichTextSegment).min(1);

/** Image reference. Dimensions are the intrinsic size of the file. */
export const Image = z.object({
  src: z.string().min(1),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

/** Money in minor units (cents) + ISO 4217 currency; formatted with Intl. */
export const Money = z.object({
  amountMinor: z.number().int().nonnegative(),
  currency: z.string().length(3),
});

export const BillingInterval = z.enum(["week", "month", "year"]);

/** "From $20/mo". */
export const RecurringPrice = Money.extend({ interval: BillingInterval });

/**
 * Icon key resolved by the front end's icon map (e.g. "truck",
 * "stethoscope"). Unknown keys render without an icon.
 */
export const IconKey = z.string().min(1);

/** Short icon + label claim (hero badges, trust strip). */
export const TrustItem = z.object({
  id: Id,
  icon: IconKey,
  label: z.string().min(1),
});

export const SocialPlatform = z.enum([
  "x",
  "instagram",
  "linkedin",
  "facebook",
]);

export const SocialProfile = z.object({
  platform: SocialPlatform,
  url: z.url(),
});

export type Id = z.infer<typeof Id>;
export type RichTextSegment = z.infer<typeof RichTextSegment>;
export type RichText = z.infer<typeof RichText>;
export type Link = z.infer<typeof Link>;
export type Cta = z.infer<typeof Cta>;
export type Image = z.infer<typeof Image>;
export type Money = z.infer<typeof Money>;
export type BillingInterval = z.infer<typeof BillingInterval>;
export type RecurringPrice = z.infer<typeof RecurringPrice>;
export type IconKey = z.infer<typeof IconKey>;
export type TrustItem = z.infer<typeof TrustItem>;
export type SocialPlatform = z.infer<typeof SocialPlatform>;
export type SocialProfile = z.infer<typeof SocialProfile>;
