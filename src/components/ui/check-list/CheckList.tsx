import { CheckCircleIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

export type CheckListProps = {
  items: readonly string[];
  className?: string;
};

/**
 * Bulleted list with green check icons (how it works, programs). The icon is
 * centred on the first line of each item at any font size (1lh).
 */
export function CheckList({ items, className }: CheckListProps) {
  return (
    <ul className={cn("flex flex-col gap-2", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-body text-copy">
          <CheckCircleIcon className="mt-[calc((1lh-1.5rem)/2)] size-6 shrink-0 text-green-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
