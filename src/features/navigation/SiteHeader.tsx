"use client";

import { useEffect, useState } from "react";
import { LogoIcon } from "@/components/icons";
import { CtaButton } from "@/features/shared/CtaButton";
import { HomeLink } from "@/features/shared/HomeLink";
import { cn } from "@/lib/cn";
import { uiCopy } from "@/lib/ui-copy";
import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./NavLink";
import type { NavigationProps } from "./to-navigation-props";
import { useActiveSection } from "./use-active-section";

/**
 * Floating pill navigation, sticky 12px from the top (decision: sticky with
 * a stronger shadow once the page scrolls). Desktop layout from the `nav`
 * breakpoint (70rem), where all links fit on one line; below it the links
 * collapse into the mobile menu, so nav items never wrap.
 */
export function SiteHeader({ items, ctas }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const activeSectionId = useActiveSection(
    items.flatMap((item) => (item.sectionId ? [item.sectionId] : [])),
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [primary, secondary] = ctas;

  return (
    <header className="sticky top-3 z-40 mt-gutter px-gutter">
      <nav
        aria-label={uiCopy.nav.label}
        data-scrolled={scrolled}
        className={cn(
          "mx-auto flex h-14 max-w-content items-center justify-between rounded-full bg-off-white px-3",
          "shadow-soft transition-shadow duration-(--duration-slow) data-[scrolled=true]:shadow-layered",
          "nav:grid nav:h-15 nav:grid-cols-[1fr_auto_1fr] nav:py-1.5 nav:pr-1.5 nav:pl-6",
        )}
      >
        <HomeLink
          aria-label={uiCopy.nav.home}
          className="justify-self-start rounded-full text-heading"
        >
          <LogoIcon className="h-8 w-[5.4375rem]" />
        </HomeLink>

        <ul className="hidden items-center gap-4 justify-self-center nav:flex">
          {items.map((item) => (
            <li key={item.id}>
              <NavLink
                item={item}
                active={
                  item.sectionId !== null && item.sectionId === activeSectionId
                }
              />
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 justify-self-end nav:flex">
          {primary ? <CtaButton cta={primary} size="md" /> : null}
          {secondary ? (
            <CtaButton cta={secondary} size="md" variant="outline" />
          ) : null}
        </div>

        <MobileMenu
          items={items}
          ctas={ctas}
          activeSectionId={activeSectionId}
          className="nav:hidden"
        />
      </nav>
    </header>
  );
}
