"use client";

import { useEffect, useState } from "react";

/**
 * Scroll-spy: the id of the section currently crossing the middle band of
 * the viewport, or null. Sections that don't exist yet are ignored.
 */
export function useActiveSection(sectionIds: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = sectionIds.join("|");

  useEffect(() => {
    const ids = key ? key.split("|") : [];
    const elements = ids.flatMap((id) => {
      const el = document.getElementById(id);
      return el ? [el] : [];
    });
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
          else
            setActive((current) =>
              current === entry.target.id ? null : current,
            );
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [key]);

  return active;
}
