import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  FaqList,
  HomeContent,
  type Image,
  LanguageList,
  type NavItem,
  ProductList,
  ProgramList,
  ServiceList,
  TestimonialList,
} from "../schemas";
import {
  faqs,
  homeContent,
  languages,
  products,
  programs,
  services,
  testimonials,
} from ".";

describe("mock data conforms to the API contract", () => {
  it.each([
    ["home", HomeContent, homeContent],
    ["programs", ProgramList, programs],
    ["products", ProductList, products],
    ["languages", LanguageList, languages],
    ["services", ServiceList, services],
    ["testimonials", TestimonialList, testimonials],
    ["faqs", FaqList, faqs],
  ] as const)("%s parses", (_name, schema, data) => {
    expect(schema.safeParse(data).success).toBe(true);
  });
});

describe("references between resources resolve", () => {
  const programIds = new Set(programs.map((p) => p.id));
  const programRefs = (items: NavItem[]) =>
    items.flatMap((item) => (item.kind === "program" ? [item.programId] : []));

  it("every program reference points at a program", () => {
    const refs = [
      ...programRefs(homeContent.navigation.items),
      ...homeContent.footer.columns.flatMap((c) => programRefs(c.items)),
      ...homeContent.hero.categories.programIds,
      ...homeContent.programs.programIds,
      ...products.map((p) => p.programId),
      ...testimonials.flatMap((t) => (t.kind === "quote" ? [t.programId] : [])),
    ];
    expect(refs.filter((id) => !programIds.has(id))).toEqual([]);
  });

  it("every CTA reference points at a shared CTA", () => {
    const refs = [
      ...homeContent.navigation.ctaRefs,
      homeContent.hero.ctaRef,
      homeContent.hero.categories.ctaRef,
      homeContent.programs.productCtaRef,
      homeContent.closingCta.ctaRef,
    ];
    expect(refs.filter((ref) => !(ref in homeContent.ctas))).toEqual([]);
  });

  it("composed id lists point at existing items", () => {
    const missing = (ids: string[], items: { id: string }[]) =>
      ids.filter((id) => !items.some((item) => item.id === id));
    expect(missing(homeContent.onlineCare.serviceIds, services)).toEqual([]);
    expect(missing(homeContent.stories.testimonialIds, testimonials)).toEqual(
      [],
    );
    expect(missing(homeContent.faq.faqIds, faqs)).toEqual([]);
  });
});

describe("mock images", () => {
  const all: Image[] = [
    ...programs.flatMap((p) => [p.card.image, p.section.image]),
    ...products.map((p) => p.image),
    ...services.flatMap((s) =>
      s.media.kind === "chat"
        ? [s.media.image, s.media.chat.providerAvatar]
        : [s.media.image],
    ),
    ...testimonials.flatMap((t) => (t.kind === "photo" ? [t.photo] : [])),
  ];

  it("exist in public/", () => {
    const missing = all.filter(
      (image) => !existsSync(join(process.cwd(), "public", image.src)),
    );
    expect(missing.map((image) => image.src)).toEqual([]);
  });
});
