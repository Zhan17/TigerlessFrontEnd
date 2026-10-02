import { cva, type VariantProps } from "class-variance-authority";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { ArrowRightCircleFilledIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * Pill button from the design. Sizes: lg = 56px (hero CTA, BMI), md = 48px
 * (nav, cards, menu). Variants: primary (dark), secondary (white, on tinted
 * cards), outline (Login).
 *
 * Interaction states are self-designed (the file has no hover designs):
 * hover = slight "bubble" lift + tone shift, pressed = slight shrink, focus =
 * the global focus ring. `hover:` only applies on devices that can hover, so
 * touch screens get the press feedback only. Styled with CSS so Storybook's
 * pseudo-states addon can show each state.
 */
export const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-full",
    "text-button font-medium whitespace-nowrap select-none",
    "transition-[scale,translate,background-color,box-shadow,color] duration-(--duration-base) ease-standard",
    "not-disabled:hover:scale-[1.03] not-disabled:active:scale-[0.97]",
    "disabled:cursor-not-allowed disabled:opacity-40",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-on-primary not-disabled:hover:bg-brand-800 not-disabled:hover:shadow-soft",
        secondary:
          "bg-surface text-heading-strong not-disabled:hover:shadow-card",
        outline:
          "border border-primary bg-transparent text-heading not-disabled:hover:bg-selected",
      },
      // min-h rather than h: a long label in a full-width button may wrap
      // to two lines on very narrow screens instead of overflowing.
      size: {
        lg: "min-h-14 px-8 py-2",
        md: "min-h-12 px-8 py-2",
        /** md (48) on mobile, lg (56) from the lg breakpoint. */
        responsive: "min-h-12 px-8 py-2 lg:min-h-14",
      },
      withArrow: {
        true: "pr-2",
        false: "",
      },
      fullWidth: {
        true: "w-full whitespace-normal text-left",
        false: "",
        /** Full width on mobile / tablet, natural width from lg. */
        belowLg:
          "w-full whitespace-normal text-left lg:w-auto lg:whitespace-nowrap",
      },
    },
    compoundVariants: [
      // Full-width buttons with an arrow (mobile cards) push the arrow to the edge.
      {
        fullWidth: true,
        withArrow: true,
        className: "justify-between pl-6",
      },
      {
        fullWidth: "belowLg",
        withArrow: true,
        className: "justify-between pl-6 lg:justify-center lg:pl-8",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      withArrow: false,
      fullWidth: false,
    },
  },
);

const arrowStyles = {
  // Primary: white circle, dark arrow. Secondary: dark circle, white arrow.
  primary: "text-white [--icon-contrast:var(--color-brand-900)]",
  secondary: "text-ink-900 [--icon-contrast:var(--color-white)]",
  outline: "text-primary [--icon-contrast:var(--color-white)]",
} as const;

type Variant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
type Size = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

/** Two-tone arrow used inside buttons; nudges right on hover. */
export function ButtonArrow({
  variant,
  size,
}: {
  variant: Variant;
  size: Size;
}) {
  return (
    <ArrowRightCircleFilledIcon
      className={cn(
        "shrink-0 transition-transform duration-(--duration-base) ease-standard",
        "group-hover/button:translate-x-0.5 group-disabled/button:translate-x-0",
        size === "lg"
          ? "size-10"
          : size === "responsive"
            ? "size-8 lg:size-10"
            : "size-8",
        arrowStyles[variant],
      )}
    />
  );
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    children: ReactNode;
  };

export function Button({
  variant = "primary",
  size = "md",
  withArrow = false,
  fullWidth = false,
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        buttonVariants({ variant, size, withArrow, fullWidth }),
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {withArrow ? (
        <ButtonArrow variant={variant ?? "primary"} size={size ?? "md"} />
      ) : null}
    </button>
  );
}

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants> & {
    href: string;
    children: ReactNode;
  };

/** Same look as Button, rendered as a link. External URLs open a new tab. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  withArrow = false,
  fullWidth = false,
  className,
  href,
  children,
  ...props
}: ButtonLinkProps) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className={cn(
        buttonVariants({ variant, size, withArrow, fullWidth }),
        className,
      )}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      <span>{children}</span>
      {withArrow ? (
        <ButtonArrow variant={variant ?? "primary"} size={size ?? "md"} />
      ) : null}
    </a>
  );
}
