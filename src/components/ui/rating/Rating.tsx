import { StarIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { uiCopy } from "@/lib/ui-copy";

export type RatingProps = {
  /** Whole stars, clamped to 0..max. */
  value: number;
  max?: number;
  className?: string;
};

const positions = (count: number) => Array.from({ length: count }, (_, i) => i);

/** Row of stars (testimonials). Read as one label by screen readers. */
export function Rating({ value, max = 5, className }: RatingProps) {
  const filled = Math.max(0, Math.min(max, Math.round(value)));
  return (
    <div
      role="img"
      aria-label={uiCopy.rating.label(filled, max)}
      className={cn("flex gap-1", className)}
    >
      {positions(max).map((position) => (
        <StarIcon
          key={position}
          className={cn(
            "size-6",
            position < filled ? "text-star" : "text-border",
          )}
        />
      ))}
    </div>
  );
}
