import type { MouseEventHandler } from "react";
import type { NavItemView } from "@/features/shared/nav-items";
import { TextAction } from "@/features/shared/TextAction";
import { cn } from "@/lib/cn";

type NavLinkProps = {
  item: NavItemView;
  active?: boolean;
  size?: "md" | "lg";
  onClick?: MouseEventHandler<HTMLElement>;
};

/**
 * Text nav item. Self-designed states: hover = text lifts slightly and turns
 * green, pressed = settles back with a small shrink, focus = global ring,
 * current section = green with an underline.
 */
export function NavLink({
  item,
  active = false,
  size = "md",
  onClick,
}: NavLinkProps) {
  return (
    <TextAction
      link={item.link}
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex items-center rounded-full px-2 text-heading",
        "transition-[translate,scale,color] duration-(--duration-base) ease-standard",
        "hover:-translate-y-0.5 hover:text-accent active:translate-y-0 active:scale-[0.97]",
        "aria-[current=true]:text-accent aria-[current=true]:underline aria-[current=true]:decoration-2 aria-[current=true]:underline-offset-8",
        size === "md" ? "h-9 text-button" : "h-9.5 text-title font-medium",
      )}
    >
      {item.label}
    </TextAction>
  );
}
