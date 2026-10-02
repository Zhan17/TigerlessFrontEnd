import type { TrustItem } from "@/content/schemas";
import { iconFor } from "@/features/shared/icon-map";
import { cn } from "@/lib/cn";
import { uiCopy } from "@/lib/ui-copy";

function Items({ items, hidden }: { items: TrustItem[]; hidden?: boolean }) {
  return (
    <ul
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
 * Dark full-bleed band that scrolls left on its own (decision C2: pure CSS
 * marquee). The track holds two identical copies and moves by -50%, so the
 * loop is seamless at any width. Self-designed: pauses on hover; static and
 * wrapping under reduced motion.
 */
export function TrustStrip({ items }: { items: TrustItem[] }) {
  if (items.length === 0) return null;
  return (
    <section
      aria-label={uiCopy.trustStrip.label}
      className="mt-strip-top overflow-hidden bg-inverse py-5 text-strip text-white"
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:px-gutter">
        <Items items={items} />
        <Items items={items} hidden />
      </div>
    </section>
  );
}
