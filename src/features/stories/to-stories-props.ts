import type { SocialLink } from "@/components/ui/social-links";
import { pickByIds } from "@/content/api/pick-by-ids";
import type {
  HomeContent,
  Image,
  Program,
  RichText,
  SocialProfile,
  Testimonial,
} from "@/content/schemas";
import { uiCopy } from "@/lib/ui-copy";

export type StoryAuthor = {
  name: string;
  location: string;
  socials: SocialLink[];
};

export type StoryCardProps =
  | {
      kind: "quote";
      id: string;
      /** Program name, e.g. "Weight Loss" (null if the program is gone). */
      category: string | null;
      rating: number;
      quote: string;
      author: StoryAuthor;
    }
  | { kind: "photo"; id: string; photo: Image; author: StoryAuthor };

export type StoriesProps = {
  heading: RichText;
  subtitle: string | null;
  stories: StoryCardProps[];
};

const toSocialLinks = (
  name: string,
  socials: readonly SocialProfile[],
): SocialLink[] =>
  socials.map(({ platform, url }) => ({
    platform,
    href: url,
    label: uiCopy.social.profile(name, uiCopy.social.platforms[platform]),
  }));

/** API content -> "Our Success Stories" (order from home content). */
export function toStoriesProps(
  home: HomeContent,
  testimonials: readonly Testimonial[],
  programs: readonly Program[],
): StoriesProps {
  const { heading, subtitle, testimonialIds } = home.stories;
  return {
    heading,
    subtitle: subtitle ?? null,
    stories: pickByIds(testimonialIds, testimonials).map((item) => {
      const author: StoryAuthor = {
        name: item.author.name,
        location: item.author.location,
        socials: toSocialLinks(item.author.name, item.author.socials),
      };
      return item.kind === "quote"
        ? {
            kind: "quote",
            id: item.id,
            category:
              programs.find((program) => program.id === item.programId)?.name ??
              null,
            rating: item.rating,
            quote: item.quote,
            author,
          }
        : { kind: "photo", id: item.id, photo: item.photo, author };
    }),
  };
}
