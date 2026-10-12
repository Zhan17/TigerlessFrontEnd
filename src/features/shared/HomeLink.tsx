"use client";

import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";

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
 *
 * States (same language as the other controls): hover = slight lift in
 * scale (callers add a colour shift), pressed = small shrink, focus = the
 * global ring.
 */
export function HomeLink({ children, className, ...props }: HomeLinkProps) {
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
    <a
      href="/"
      onClick={onClick}
      className={cn(
        "inline-block transition-[scale,color] duration-(--duration-base) ease-standard hover:scale-[1.03] active:scale-[0.97]",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
