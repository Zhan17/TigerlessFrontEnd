import type {
  Cta,
  HighlightCard,
  HomeContent,
  Image,
  Product,
  Program,
  RecurringPrice,
  RichText,
} from "@/content/schemas";

export type ProductCardProps = {
  id: string;
  name: string;
  price: RecurringPrice;
  image: Image;
  cta: Cta | null;
};

export type ProgramSectionProps = {
  id: string;
  /** Program category -> theme (unknown -> default). */
  category: string;
  imageSide: "left" | "right";
  /** Program name shown as the eyebrow (only when the content asks for it). */
  eyebrow: string | null;
  heading: RichText;
  intro: string[];
  points: string[];
  startingPrice: RecurringPrice | null;
  cta: Cta;
  image: Image;
  highlights: HighlightCard[];
  products: ProductCardProps[];
};

/**
 * Layout per category is presentation, so it lives here, not in the data:
 * the design puts the sleep image on the left, everything else on the right.
 */
const imageSideByCategory: Record<string, "left" | "right"> = {
  sleep: "left",
};

/** API content -> program sections (in the order home content lists them). */
export function toProgramSectionsProps(
  home: HomeContent,
  programs: readonly Program[],
  products: readonly Product[],
): ProgramSectionProps[] {
  const productCta = home.ctas[home.programs.productCtaRef] ?? null;

  return home.programs.programIds.flatMap((id) => {
    const program = programs.find((p) => p.id === id);
    if (!program) return [];
    const { section } = program;
    return [
      {
        id: program.id,
        category: program.category,
        imageSide: imageSideByCategory[program.category] ?? "right",
        eyebrow: section.showEyebrow ? program.name : null,
        heading: section.heading,
        intro: section.intro,
        points: section.points,
        startingPrice: section.startingPrice ?? null,
        cta: section.cta,
        image: section.image,
        highlights: section.highlights ?? [],
        products: products
          .filter((product) => product.programId === program.id)
          .map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            cta: productCta,
          })),
      },
    ];
  });
}
