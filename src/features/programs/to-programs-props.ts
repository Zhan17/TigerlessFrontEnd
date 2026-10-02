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

/** Desktop layout of a feature card (measured on the 1440 board). */
export type SectionLayout = {
  /** Min height of the card from lg, rem (the photo scales with it). */
  minHeight: number;
  /** Max width of the copy column (heading, intro, price divider), rem. */
  copyWidth: number;
  /** Horizontal centre of the photo, % of the card width. */
  imageCenterX: number;
  /** Photo height, % of the card height (>100 rises above the card). */
  imageHeight: number;
  /**
   * Max photo width, % of the card width: its share at 1440. Narrower cards
   * (1024-1440) shrink the photo in place instead of letting it run into
   * the copy column.
   */
  imageMaxWidth: number;
};

export type ProgramSectionProps = {
  id: string;
  /** Program category -> theme (unknown -> default). */
  category: string;
  imageSide: "left" | "right";
  layout: SectionLayout;
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
 * Layout per category is presentation, so it lives here, not in the data.
 * Values measured on the 1440 board: the sleep photo sits on the left, and
 * each card has its own copy width and photo height / position.
 */
const imageSideByCategory: Record<string, "left" | "right"> = {
  sleep: "left",
};

const layoutByCategory: Record<string, SectionLayout> = {
  "weight-loss": {
    minHeight: 38.6875,
    copyWidth: 28.5,
    imageCenterX: 70.7,
    imageHeight: 111.8,
    imageMaxWidth: 46.8,
  },
  "birth-control": {
    minHeight: 44.875,
    copyWidth: 38.5,
    imageCenterX: 79.5,
    imageHeight: 104.6,
    imageMaxWidth: 30.7,
  },
  sleep: {
    minHeight: 44.875,
    copyWidth: 34.4375,
    imageCenterX: 23.9,
    imageHeight: 104.7,
    imageMaxWidth: 44.6,
  },
};
const defaultLayout: SectionLayout = {
  minHeight: 42,
  copyWidth: 34.5,
  imageCenterX: 72,
  imageHeight: 105,
  imageMaxWidth: 45,
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
        layout: layoutByCategory[program.category] ?? defaultLayout,
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
