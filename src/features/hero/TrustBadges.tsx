import type { TrustItem } from "@/content/schemas";
import { iconFor } from "@/features/shared/icon-map";

/**
 * Small icon + label claims above the headline. `flex-wrap-reverse` gives
 * the mobile board's arrangement for free: the last badge wraps onto its
 * own line *above* the others.
 */
export function TrustBadges({ items }: { items: TrustItem[] }) {
  return (
    <ul className="flex flex-wrap-reverse items-center justify-center gap-x-badge-gap gap-y-1">
      {items.map((item) => {
        const Icon = iconFor(item.icon);
        return (
          <li
            key={item.id}
            className="flex items-center gap-1 py-0.5 text-badge font-medium text-accent-soft sm:gap-2 lg:py-1"
          >
            {Icon ? <Icon className="size-[1.4em] shrink-0" /> : null}
            {item.label}
          </li>
        );
      })}
    </ul>
  );
}
