"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { useEffect, useState } from "react";
import { ChevronUpIcon } from "@/components/icons";
import type { Faq } from "@/content/schemas";
import { cn } from "@/lib/cn";

type Props = {
  items: readonly Faq[];
  /** Items open on first render; the design opens the first one. */
  defaultOpen?: string[];
  className?: string;
};

/**
 * FAQ list (Radix Accordion, several items may be open at once). Radix
 * provides the button / region wiring, arrow-key navigation between
 * questions and the measured height used by the open / close animation.
 *
 * States (self-designed, CSS so the pseudo-states addon can show them):
 * closed hover tints the row and pops the chevron; open = sage header with
 * white text, dashed edge and a raised shadow; pressed shrinks slightly.
 */
export function FaqAccordion({ items, defaultOpen, className }: Props) {
  const first = items[0]?.id;
  // The height animation needs Radix's measured height, which exists only
  // after hydration; animating before that collapses the open answer on
  // page load. So the animation classes switch on after mount.
  const [animate, setAnimate] = useState(false);
  useEffect(() => setAnimate(true), []);
  return (
    <Accordion.Root
      type="multiple"
      defaultValue={defaultOpen ?? (first ? [first] : [])}
      data-animate={animate || undefined}
      className={cn("group/faq flex flex-col gap-5", className)}
    >
      {items.map((item) => (
        <Accordion.Item
          key={item.id}
          value={item.id}
          className="group/item overflow-hidden rounded-panel bg-surface transition-shadow duration-(--duration-slow) data-[state=open]:shadow-raised"
        >
          <Accordion.Header>
            <Accordion.Trigger
              className={cn(
                "group/trigger flex w-full items-center justify-between gap-2 p-faq-pad text-left lg:gap-4",
                "text-title text-ink-800 transition-[background-color,color,scale] duration-(--duration-base) ease-standard",
                "hover:bg-faq-tint active:scale-[0.99]",
                "data-[state=open]:bg-sage-500 data-[state=open]:text-white data-[state=open]:hover:bg-sage-400",
                // The focus ring sits inside the rounded, clipped item.
                "focus-visible:-outline-offset-4",
              )}
            >
              <span>{item.question}</span>
              <span
                aria-hidden
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-ink-400",
                  "transition-[scale,color,border-color] duration-(--duration-base) ease-standard",
                  "group-hover/trigger:scale-[1.08]",
                  "group-data-[state=open]/trigger:border-white group-data-[state=open]/trigger:text-ink-900",
                )}
              >
                <ChevronUpIcon className="size-6 rotate-180 transition-transform duration-(--duration-slow) ease-out-expo group-data-[state=open]/trigger:rotate-0" />
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden group-data-animate/faq:data-[state=closed]:animate-accordion-up group-data-animate/faq:data-[state=open]:animate-accordion-down">
            {/* Dashed edge over a faint tint strip, as in the design. */}
            <div className="border-t-2 border-dashed border-sage-500 bg-faq-tint pt-0.75">
              <div className="flex flex-col gap-3 bg-surface p-faq-pad text-body-sm text-copy">
                {item.answer.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
