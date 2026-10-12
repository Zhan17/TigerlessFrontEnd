import type { SocialLink } from "@/components/ui/social-links";
import type { Cta, HomeContent, Program, RichText } from "@/content/schemas";
import { type NavItemView, resolveNavItems } from "@/features/shared/nav-items";
import { uiCopy } from "@/lib/ui-copy";

export type ClosingCtaProps = {
  heading: RichText;
  points: string[];
  cta: Cta | null;
};

export type FooterColumnView = {
  id: string;
  title: string;
  items: NavItemView[];
};

export type SiteFooterProps = {
  tagline: string;
  columns: FooterColumnView[];
  disclaimer: string[];
  terms: RichText;
  socials: SocialLink[];
  copyright: string;
};

/** API content -> closing call to action (the CTA label lives in home.ctas). */
export function toClosingCtaProps(home: HomeContent): ClosingCtaProps {
  const { heading, points, ctaRef } = home.closingCta;
  return { heading, points, cta: home.ctas[ctaRef] ?? null };
}

/** API content -> footer. Program links take the program's name. */
export function toFooterProps(
  home: HomeContent,
  programs: readonly Program[],
  year: number,
): SiteFooterProps {
  const { footer } = home;
  return {
    tagline: footer.tagline,
    columns: footer.columns.map((column) => ({
      id: column.id,
      title: column.title,
      items: resolveNavItems(column.items, programs),
    })),
    disclaimer: footer.disclaimer,
    terms: footer.terms,
    socials: footer.socials.map(({ platform, url }) => ({
      platform,
      href: url,
      label: uiCopy.social.profile(
        footer.copyrightHolder,
        uiCopy.social.platforms[platform],
      ),
    })),
    copyright: uiCopy.footer.copyright(year, footer.copyrightHolder),
  };
}
