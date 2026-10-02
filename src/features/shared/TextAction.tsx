import type { MouseEventHandler, ReactNode } from "react";
import type { Link } from "@/content/schemas";
import { cn } from "@/lib/cn";
import { hrefFor } from "./link";

type TextActionProps = {
  link: Link;
  children: ReactNode;
  className?: string;
  /** e.g. close the mobile menu after choosing an item. */
  onClick?: MouseEventHandler<HTMLElement>;
  "aria-current"?: "true" | undefined;
};

/**
 * Text link for nav, footer and inline copy. Without a destination it is a
 * button (press feedback only) so it stays keyboard accessible.
 */
export function TextAction({
  link,
  children,
  className,
  onClick,
  ...aria
}: TextActionProps) {
  const href = hrefFor(link);
  if (!href) {
    return (
      <button type="button" className={className} onClick={onClick} {...aria}>
        {children}
      </button>
    );
  }
  const external = link.type === "external";
  return (
    <a
      href={href}
      className={cn(className)}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...aria}
    >
      {children}
    </a>
  );
}
