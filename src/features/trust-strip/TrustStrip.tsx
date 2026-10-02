"use client";

import { useEffect, useRef, useState } from "react";
import type { TrustItem } from "@/content/schemas";
import { iconFor } from "@/features/shared/icon-map";
import { cn } from "@/lib/cn";
import { uiCopy } from "@/lib/ui-copy";

/** Scroll speed, px per second (about the board's original pace). */
const SPEED = 42;
/**
 * Copies per half on the server render: two sets already cover any width
 * up to ~2700px, so most screens never change after hydration.
 */
const DEFAULT_REPEATS = 2;

function Items({
  items,
  hidden,
  setRef,
}: {
  items: TrustItem[];
  hidden?: boolean;
  setRef?: (node: HTMLUListElement | null) => void;
}) {
  return (
    <ul
      ref={setRef}
      aria-hidden={hidden || undefined}
      className={cn(
        "flex shrink-0 items-center gap-strip-gap pr-strip-gap",
        // Reduced motion: one static, wrapping copy.
        hidden && "motion-reduce:hidden",
        "motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:pr-0",
      )}
    >
      {items.map((item) => {
        const Icon = iconFor(item.icon);
        return (
          <li
            key={item.id}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            {Icon ? <Icon className="size-6 shrink-0" /> : null}
            {item.label}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Dark full-bleed band that scrolls left on its own (decision C2: CSS
 * marquee). The track is two identical halves and moves by -50%, which
 * loops seamlessly only if one half is at least as wide as the band; so
 * each half repeats the item set as often as the band's width needs
 * (measured, and re-measured on resize), and the duration follows the
 * half's length to keep the same speed everywhere. No gap ever opens at
 * the end and nothing pops in. Pauses on hover; static and wrapping under
 * reduced motion. Only the first set is exposed to assistive tech.
 */
export function TrustStrip({ items }: { items: TrustItem[] }) {
  const band = useRef<HTMLElement>(null);
  const set = useRef<HTMLUListElement | null>(null);
  const [layout, setLayout] = useState({
    repeats: DEFAULT_REPEATS,
    duration: 0,
  });

  useEffect(() => {
    const bandNode = band.current;
    const setNode = set.current;
    if (!bandNode || !setNode) return;
    const measure = () => {
      const setWidth = setNode.offsetWidth;
      if (setWidth === 0) return;
      const repeats = Math.max(
        DEFAULT_REPEATS,
        Math.ceil(bandNode.offsetWidth / setWidth),
      );
      setLayout({ repeats, duration: (repeats * setWidth) / SPEED });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(bandNode);
    observer.observe(setNode); // web font swap changes the set width
    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;
  const copies = layout.repeats * 2;
  return (
    <section
      ref={band}
      aria-label={uiCopy.trustStrip.label}
      className="mt-strip-top overflow-hidden bg-inverse py-5 text-strip text-white"
    >
      <div
        className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:px-gutter"
        style={
          layout.duration ? { animationDuration: `${layout.duration}s` } : {}
        }
      >
        {Array.from({ length: copies }, (_, copy) => (
          <Items
            // biome-ignore lint/suspicious/noArrayIndexKey: identical copies, the index is their identity
            key={copy}
            items={items}
            hidden={copy > 0}
            setRef={
              copy === 0
                ? (node) => {
                    set.current = node;
                  }
                : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}
