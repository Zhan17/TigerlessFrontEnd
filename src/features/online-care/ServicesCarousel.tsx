"use client";

import {
  type AnimationPlaybackControls,
  animate,
  useReducedMotion,
} from "motion/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowRightCircleIcon } from "@/components/icons";
import { IconButton } from "@/components/ui/icon-button";
import { RichText } from "@/features/shared/RichText";
import { cn } from "@/lib/cn";
import { uiCopy } from "@/lib/ui-copy";
import { ServiceCard } from "./ServiceCard";
import type { OnlineCareProps } from "./to-online-care-props";

type Props = OnlineCareProps & {
  /** Start scrolled to this card (stories: the "end" state). */
  defaultIndex?: number;
  className?: string;
};

const copy = uiCopy.carousel;

/** Same curve as --ease-out-expo. */
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * Snap positions of the cards (scrollLeft values), clamped to the scroll
 * range and de-duplicated: the last cards share the max position when they
 * all fit on screen. The track is the cards' offset parent, and its
 * padding-left equals its scroll-padding (read the padding: the computed
 * scroll-padding keeps the unresolved max() expression).
 */
function snapPositions(track: HTMLElement): number[] {
  const inset = Number.parseFloat(getComputedStyle(track).paddingLeft) || 0;
  const max = track.scrollWidth - track.clientWidth;
  const positions = [...track.children].map((child) =>
    Math.min(Math.max((child as HTMLElement).offsetLeft - inset, 0), max),
  );
  return [...new Set(positions.map(Math.round))];
}

/**
 * "Completely online on your schedule": a horizontal, swipeable card row.
 *
 * - Native overflow scrolling with scroll-snap, so touch swipe, trackpads
 *   and keyboard scrolling work without JS.
 * - The arrows step one card with an ease-out-expo glide (Motion animates
 *   scrollLeft; snapping is paused during the glide so it does not fight
 *   the animation). Reduced motion jumps instead.
 * - The arrows are disabled at the ends (the agreed disabled states).
 * - The row starts at the content edge and bleeds off the right edge of the
 *   viewport, as on both boards.
 */
export function ServicesCarousel({
  heading,
  services,
  defaultIndex = 0,
  className,
}: Props) {
  const headingId = useId();
  const trackId = useId();
  const trackRef = useRef<HTMLUListElement>(null);
  const glide = useRef<AnimationPlaybackControls | null>(null);
  const reduceMotion = useReducedMotion();
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setEdges({
      atStart: track.scrollLeft <= 1,
      atEnd: track.scrollLeft >= max - 1,
    });
  }, []);

  const stopGlide = useCallback(() => {
    glide.current?.stop();
    glide.current = null;
    if (trackRef.current) trackRef.current.style.scrollSnapType = "";
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (defaultIndex > 0) {
      const target = snapPositions(track)[defaultIndex];
      if (target !== undefined) track.scrollLeft = target;
    }
    updateEdges();
    track.addEventListener("scroll", updateEdges, { passive: true });
    // A swipe or wheel during a glide takes over immediately.
    track.addEventListener("pointerdown", stopGlide, { passive: true });
    track.addEventListener("wheel", stopGlide, { passive: true });
    const resize = new ResizeObserver(updateEdges);
    resize.observe(track);
    return () => {
      track.removeEventListener("scroll", updateEdges);
      track.removeEventListener("pointerdown", stopGlide);
      track.removeEventListener("wheel", stopGlide);
      resize.disconnect();
      stopGlide();
    };
  }, [defaultIndex, updateEdges, stopGlide]);

  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const from = track.scrollLeft;
    const positions = snapPositions(track);
    const target =
      direction === 1
        ? positions.find((position) => position > from + 1)
        : positions.findLast((position) => position < from - 1);
    if (target === undefined) return;

    stopGlide();
    if (reduceMotion) {
      track.scrollLeft = target;
      return;
    }
    track.style.scrollSnapType = "none";
    glide.current = animate(from, target, {
      duration: 0.7,
      ease: EASE_OUT_EXPO,
      onUpdate: (value) => {
        track.scrollLeft = value;
      },
      onComplete: () => {
        glide.current = null;
        track.style.scrollSnapType = "";
      },
    });
  };

  return (
    <section
      aria-labelledby={headingId}
      aria-roledescription={copy.roleDescription}
      className={cn("pt-carousel-top pb-section-y", className)}
    >
      <div className="mx-auto box-content flex max-w-content flex-col gap-3 px-gutter md:flex-row md:items-end md:justify-between md:gap-8">
        <h2
          id={headingId}
          className="max-w-[33.6875rem] text-section font-medium text-heading"
        >
          <RichText segments={heading} />
        </h2>
        <div className="flex gap-2 self-end">
          <IconButton
            label={copy.previous}
            icon={ArrowRightCircleIcon}
            iconClassName="rotate-180"
            aria-controls={trackId}
            disabled={edges.atStart}
            onClick={() => step(-1)}
          />
          <IconButton
            label={copy.next}
            icon={ArrowRightCircleIcon}
            aria-controls={trackId}
            disabled={edges.atEnd}
            onClick={() => step(1)}
          />
        </div>
      </div>

      {/* The track scrolls but holds no links, so it takes focus itself:
          keyboard users can scroll it with the arrow keys. */}
      <ul
        ref={trackRef}
        id={trackId}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must be keyboard focusable (WCAG 2.1.1)
        tabIndex={0}
        aria-labelledby={headingId}
        className={cn(
          "relative mt-carousel-gap flex snap-x snap-mandatory gap-service-gap overflow-x-auto overscroll-x-contain",
          "[--track-inset:max(var(--spacing-gutter),calc((100%-var(--container-content))/2))]",
          "pr-gutter pl-(--track-inset) scroll-pl-(--track-inset)",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "focus-visible:-outline-offset-2",
        )}
      >
        {services.map((service, index) => (
          <li key={service.id} className="shrink-0 snap-start">
            {/* biome-ignore lint/a11y/useSemanticElements: APG carousel slide pattern (group + roledescription) */}
            <div
              role="group"
              aria-roledescription={copy.slideRoleDescription}
              aria-label={copy.slide(index + 1, services.length)}
            >
              <ServiceCard {...service} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
