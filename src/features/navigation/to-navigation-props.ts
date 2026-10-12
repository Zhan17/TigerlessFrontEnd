import type { Cta, HomeContent, Program } from "@/content/schemas";
import { type NavItemView, resolveNavItems } from "@/features/shared/nav-items";

export type NavigationProps = {
  items: NavItemView[];
  /** [primary, secondary]: "Get started", "Login". */
  ctas: Cta[];
};

/** API content -> navigation props. */
export function toNavigationProps(
  home: HomeContent,
  programs: readonly Program[],
): NavigationProps {
  return {
    items: resolveNavItems(home.navigation.items, programs),
    ctas: home.navigation.ctaRefs.flatMap((ref) => {
      const cta = home.ctas[ref];
      return cta ? [cta] : [];
    }),
  };
}
