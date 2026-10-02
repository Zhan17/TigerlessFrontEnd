"use client";

import { useReducedMotion } from "motion/react";
import {
  type MouseEvent,
  type PointerEvent,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Pill } from "@/components/ui/pill";
import type { Language } from "@/content/schemas";
import { cn } from "@/lib/cn";

/** Pixels per second. */
const BASE_SPEED = 28;
const EDGE_SPEED = 260;
/** Movement (px) after which a touch counts as a drag, not a tap. */
const DRAG_THRESHOLD = 6;

type Zone = "left" | "right" | "center" | null;

type StartPosition = { index: number; shift: number };

/**
 * Initial positions matching the design boards: which pill sits at the left
 * edge and how much of it is hidden behind the fade. Module constants so
 * re-renders (e.g. toggling a pill) never reset the scroll position.
 */
const ROW_STARTS: { desktop: StartPosition; mobile: StartPosition }[] = [
  { desktop: { index: 2, shift: 0.15 }, mobile: { index: 4, shift: 0.1 } },
  { desktop: { index: 2, shift: 0.25 }, mobile: { index: 4, shift: 0.5 } },
];

type LanguageMarqueeProps = {
  languages: Language[];
  /** Codes highlighted initially (K16: multi-select, zh + pt). */
  highlighted: string[];
  /** Accessible name of the group. */
  label: string;
};

/**
 * Two rows of language pills drifting in opposite directions (decision C1):
 * hovering a faded edge speeds the row towards it, hovering the middle
 * pauses, touch devices drag to scrub with inertia. Pills toggle a visual
 * highlight (multi-select). Under reduced motion the rows are static and
 * scroll horizontally instead.
 */
export function LanguageMarquee({
  languages,
  highlighted,
  label,
}: LanguageMarqueeProps) {
  const [selected, setSelected] = useState(() => new Set(highlighted));
  const reduce = useReducedMotion() ?? false;
  const zone = useRef<Zone>(null);
  const fadeRef = useRef<HTMLDivElement>(null);

  const toggle = (code: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });

  const onPointerMove = (event: PointerEvent<HTMLFieldSetElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const edge = fadeRef.current?.offsetWidth ?? 0;
    const x = event.clientX - rect.left;
    zone.current =
      x < edge ? "left" : x > rect.width - edge ? "right" : "center";
  };

  const half = Math.ceil(languages.length / 2);
  const rows = [languages.slice(0, half), languages.slice(half)];

  return (
    <div className="mx-auto w-full max-w-[68.5rem] px-2">
      <fieldset
        className="relative m-0 flex min-w-0 flex-col gap-pill-gap border-0 p-0"
        onPointerMove={onPointerMove}
        onPointerLeave={() => {
          zone.current = null;
        }}
      >
        <legend className="sr-only">{label}</legend>
        <MarqueeRow
          items={rows[0] ?? []}
          direction={-1}
          start={ROW_STARTS[0]?.desktop ?? FALLBACK_START}
          startMobile={ROW_STARTS[0]?.mobile ?? FALLBACK_START}
          zone={zone}
          edge={fadeRef}
          reduce={reduce}
          selected={selected}
          onToggle={toggle}
        />
        <MarqueeRow
          items={rows[1] ?? []}
          direction={1}
          start={ROW_STARTS[1]?.desktop ?? FALLBACK_START}
          startMobile={ROW_STARTS[1]?.mobile ?? FALLBACK_START}
          zone={zone}
          edge={fadeRef}
          reduce={reduce}
          selected={selected}
          onToggle={toggle}
        />
        {/* Edge fades from the design (white -> transparent). */}
        <div
          ref={fadeRef}
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-fade bg-linear-to-r from-surface to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-fade bg-linear-to-l from-surface to-transparent"
        />
      </fieldset>
    </div>
  );
}

const FALLBACK_START: StartPosition = { index: 0, shift: 0 };

type MarqueeRowProps = {
  items: Language[];
  /** -1 drifts left, 1 drifts right. */
  direction: -1 | 1;
  /** Initial position: which pill is at the left edge, and how much of it is hidden. */
  start: StartPosition;
  /** The mobile board starts each row at a different pill. */
  startMobile: StartPosition;
  zone: RefObject<Zone>;
  /** Edge fade: pills under it count as out of view. */
  edge: RefObject<HTMLDivElement | null>;
  reduce: boolean;
  selected: ReadonlySet<string>;
  onToggle: (code: string) => void;
};

function MarqueeRow({
  items,
  direction,
  start,
  startMobile,
  zone,
  edge,
  reduce,
  selected,
  onToggle,
}: MarqueeRowProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(2);

  const offset = useRef(0);
  const period = useRef(0);
  const paused = useRef(false);
  /** A real pill has keyboard focus: keep the row where it shows that pill. */
  const focusLock = useRef(false);
  const inertia = useRef(0);
  const drag = useRef<{
    lastX: number;
    lastT: number;
    velocity: number;
    moved: number;
  } | null>(null);
  const suppressClick = useRef(false);

  // Measure one set (+ gap) and render enough copies to cover the row.
  useEffect(() => {
    const viewport = viewportRef.current;
    const set = setRef.current;
    const track = trackRef.current;
    if (!viewport || !set || !track) return;

    const measure = () => {
      const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
      period.current = set.offsetWidth + gap;
      if (period.current > 0) {
        // Copies after the original set (one more sits before it).
        setCopies(
          Math.max(1, Math.ceil(viewport.offsetWidth / period.current)),
        );
      }
    };
    measure();

    const initial = window.innerWidth < 768 ? startMobile : start;
    const first = set.children[initial.index];
    if (first instanceof HTMLElement) {
      // The original set sits one period in (after the leading copy).
      offset.current =
        -(
          first.offsetLeft -
          set.offsetLeft +
          initial.shift * first.offsetWidth
        ) - period.current;
      // Apply now so the first paint already matches the design position.
      track.style.transform = `translate3d(${offset.current}px, 0, 0)`;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(set);
    return () => observer.disconnect();
  }, [start, startMobile]);

  // Animation loop: writes transform directly, no React re-render per frame.
  useEffect(() => {
    if (reduce) return;
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const w = period.current;

      if (w > 0 && !drag.current) {
        let velocity: number;
        if (paused.current || zone.current === "center") velocity = 0;
        else if (zone.current === "left") velocity = EDGE_SPEED;
        else if (zone.current === "right") velocity = -EDGE_SPEED;
        else velocity = direction * BASE_SPEED;

        if (inertia.current !== 0) {
          velocity += inertia.current;
          inertia.current *= 0.05 ** dt;
          if (Math.abs(inertia.current) < 5) inertia.current = 0;
        }
        offset.current += velocity * dt;
      }
      // Keep the original set within one period left of the row start, with
      // a copy on each side; a focused pill may hold the row elsewhere.
      if (w > 0 && !focusLock.current) {
        offset.current = (((offset.current % w) - w) % w) - w;
      }
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${offset.current}px, 0, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduce, direction, zone]);

  // Touch / pen: drag to scrub, keep the release velocity as inertia.
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType === "mouse") return;
    drag.current = {
      lastX: event.clientX,
      lastT: event.timeStamp,
      velocity: 0,
      moved: 0,
    };
    inertia.current = 0;
  };
  const onPointerMoveRow = (event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = event.clientX - d.lastX;
    const dt = Math.max(1, event.timeStamp - d.lastT) / 1000;
    d.moved += Math.abs(dx);
    d.velocity = dx / dt;
    d.lastX = event.clientX;
    d.lastT = event.timeStamp;
    offset.current += dx;
    if (
      d.moved > DRAG_THRESHOLD &&
      !event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };
  const endDrag = () => {
    const d = drag.current;
    if (!d) return;
    suppressClick.current = d.moved > DRAG_THRESHOLD;
    inertia.current = Math.max(-1500, Math.min(1500, d.velocity));
    drag.current = null;
  };
  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (suppressClick.current) {
      event.preventDefault();
      event.stopPropagation();
      suppressClick.current = false;
    }
  };

  // Keyboard focus lands on the real pill, which may be anywhere on the
  // moving track (often outside the clipped row while a copy shows the same
  // label). Shift the row so the focused pill sits fully inside the visible
  // part, clear of the edge fades; the copies on both sides fill the rest.
  const revealFocused = (target: EventTarget) => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!(target instanceof HTMLElement) || !viewport || !track) return;
    const view = viewport.getBoundingClientRect();
    const fade = edge.current?.offsetWidth ?? 0;
    const margin = 8;
    const min = view.left + fade + margin;
    const max = view.right - fade - margin;
    const pill = target.getBoundingClientRect();
    let delta = 0;
    if (pill.left < min) delta = min - pill.left;
    else if (pill.right > max) delta = max - pill.right;
    focusLock.current = true;
    if (delta === 0) return;
    offset.current += delta;
    track.style.transform = `translate3d(${offset.current}px, 0, 0)`;
  };

  const renderSet = (clone: boolean) =>
    items.map((language) => (
      <Pill
        key={language.code}
        lang={language.code}
        dir={language.dir}
        selected={selected.has(language.code)}
        onClick={() => onToggle(language.code)}
        tabIndex={clone ? -1 : undefined}
      >
        {language.nativeName}
      </Pill>
    ));

  if (reduce) {
    return (
      <div className="-my-1 flex gap-pill-gap overflow-x-auto px-fade py-1">
        {renderSet(false)}
      </div>
    );
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: drag gesture on touch only; pills remain the interactive elements
    <div
      ref={viewportRef}
      // -my-1/py-1: room for pill shadows and hover scale without changing layout.
      className="-my-1 touch-pan-y overflow-hidden py-1"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMoveRow}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
      onFocus={(event) => {
        paused.current = true;
        revealFocused(event.target);
      }}
      onBlur={() => {
        paused.current = false;
        focusLock.current = false;
      }}
    >
      <div
        ref={trackRef}
        className="flex w-max gap-pill-gap will-change-transform"
      >
        {/* Leading copy: lets the original set move right of the row
            start (to reveal a focused pill) without a gap opening. */}
        <div className="flex gap-pill-gap" aria-hidden>
          {renderSet(true)}
        </div>
        <div ref={setRef} className="flex gap-pill-gap">
          {renderSet(false)}
        </div>
        {Array.from({ length: copies }, (_, i) => i + 1).map((copy) => (
          // Copies are hidden from assistive tech and the tab order, but they
          // stay clickable: most of the pills on screen at any moment are
          // copies, and each toggles the same language as the original.
          <div key={copy} className={cn("flex gap-pill-gap")} aria-hidden>
            {renderSet(true)}
          </div>
        ))}
      </div>
    </div>
  );
}
