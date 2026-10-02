import type {
  Cta,
  HomeContent,
  Image,
  Language,
  Program,
  RichText,
  TrustItem,
} from "@/content/schemas";

export type CategoryCardProps = {
  id: string;
  /** Program category -> front-end theme (unknown -> default). */
  category: string;
  eyebrow: string;
  title: string;
  image: Image;
  cta: Cta | null;
};

export type HeroProps = {
  badges: TrustItem[];
  headline: RichText;
  subtitle: string[];
  cta: Cta | null;
  languages: Language[];
  highlightedLanguages: string[];
  categories: CategoryCardProps[];
};

/** API content -> hero props. Category cards come from the programs. */
export function toHeroProps(
  home: HomeContent,
  programs: readonly Program[],
  languages: readonly Language[],
): HeroProps {
  const { hero } = home;
  const categoryCta = home.ctas[hero.categories.ctaRef] ?? null;

  return {
    badges: hero.badges,
    headline: hero.headline,
    subtitle: hero.subtitle,
    cta: home.ctas[hero.ctaRef] ?? null,
    languages: [...languages],
    highlightedLanguages: hero.highlightedLanguages,
    categories: hero.categories.programIds.flatMap((id) => {
      const program = programs.find((p) => p.id === id);
      if (!program) return [];
      return [
        {
          id: program.id,
          category: program.category,
          eyebrow: program.card.eyebrow,
          title: program.card.title,
          image: program.card.image,
          cta: categoryCta,
        },
      ];
    }),
  };
}
