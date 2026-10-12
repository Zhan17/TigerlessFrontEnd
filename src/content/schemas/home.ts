import { z } from "zod";
import { Cta, Id, Link, RichText, SocialProfile, TrustItem } from "./common";

/**
 * GET /content/home — copy that exists only on the home page, plus the
 * composition of the page: which programs, services, testimonials and FAQs
 * appear, in which order, referenced by id from their own resources.
 *
 * Shared button labels are defined once in `ctas` and referenced by key, so
 * e.g. "Get started" is not repeated in the nav, the menu and product cards.
 */

/** Key into `ctas`. */
export const CtaRef = Id;

/** Nav / footer entry: either a program (label = program name) or a link. */
export const NavItem = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("program"), programId: Id }),
  z.object({ kind: z.literal("link"), label: z.string().min(1), link: Link }),
]);

export const HowItWorksStep = z.object({
  id: Id,
  title: z.string().min(1),
  description: z.string().min(1),
  points: z.array(z.string().min(1)),
});

export const FooterColumn = z.object({
  id: Id,
  title: z.string().min(1),
  items: z.array(NavItem),
});

/** Section intro: optional eyebrow, heading (with highlights), subtitle. */
const SectionIntro = z.object({
  eyebrow: z.string().min(1).optional(),
  heading: RichText,
  subtitle: z.string().min(1).optional(),
});

export const HomeContent = z.object({
  /** Bumped on breaking contract changes. */
  schemaVersion: z.literal(1),
  ctas: z.record(Id, Cta),
  navigation: z.object({
    items: z.array(NavItem),
    ctaRefs: z.array(CtaRef),
  }),
  hero: z.object({
    badges: z.array(TrustItem),
    headline: RichText,
    /** One string per line. */
    subtitle: z.array(z.string().min(1)),
    ctaRef: CtaRef,
    /** Language pills shown highlighted by default (codes from /languages). */
    highlightedLanguages: z.array(z.string()),
    categories: z.object({ programIds: z.array(Id), ctaRef: CtaRef }),
  }),
  trustStrip: z.object({ items: z.array(TrustItem).min(1) }),
  howItWorks: SectionIntro.extend({
    steps: z.array(HowItWorksStep).min(1),
    footnote: z.string().min(1).optional(),
  }),
  programs: z.object({
    /** Program sections, in page order. */
    programIds: z.array(Id),
    /** Button on product cards. */
    productCtaRef: CtaRef,
  }),
  /** BMI / eligibility checker copy. Rules and field labels live in code. */
  eligibility: z.object({
    /** Program section that hosts the checker (weight loss in the design). */
    programId: Id,
    eyebrow: z.string().min(1),
    tag: z.string().min(1),
    heading: z.string().min(1),
    helper: z.string().min(1),
    optionsCta: Cta,
  }),
  onlineCare: SectionIntro.extend({ serviceIds: z.array(Id) }),
  stories: SectionIntro.extend({ testimonialIds: z.array(Id) }),
  faq: SectionIntro.extend({ faqIds: z.array(Id) }),
  closingCta: z.object({
    heading: RichText,
    points: z.array(z.string().min(1)),
    ctaRef: CtaRef,
  }),
  footer: z.object({
    tagline: z.string().min(1),
    columns: z.array(FooterColumn),
    /** Medical / legal disclaimer, one string per paragraph. */
    disclaimer: z.array(z.string().min(1)),
    /** "By using our services, you agree to our Terms & Conditions." */
    terms: RichText,
    socials: z.array(SocialProfile),
    /** Copyright line is built as "© {year} {holder}. All rights reserved." */
    copyrightHolder: z.string().min(1),
  }),
});

export type CtaRef = z.infer<typeof CtaRef>;
export type NavItem = z.infer<typeof NavItem>;
export type HowItWorksStep = z.infer<typeof HowItWorksStep>;
export type FooterColumn = z.infer<typeof FooterColumn>;
export type HomeContent = z.infer<typeof HomeContent>;
