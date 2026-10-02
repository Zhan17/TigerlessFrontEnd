"use client";

import type { MouseEvent, ReactNode } from "react";

type HomeLinkProps = {
  "aria-label": string;
  className?: string;
  children: ReactNode;
};

/**
 * Link to the home page. Already on the home page, it glides back to the
 * top instead of reloading (and drops any #section from the URL); modified
 * clicks (new tab, etc.) and other pages keep normal link behaviour.
 * Reduced motion jumps instead of gliding.
 */
export function HomeLink({ children, ...props }: HomeLinkProps) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const modified =
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey;
    if (modified || window.location.pathname !== "/") return;

    event.preventDefault();
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  return (
    <a href="/" onClick={onClick} {...props}>
      {children}
    </a>
  );
}
