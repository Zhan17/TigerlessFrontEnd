import { cva, type VariantProps } from "class-variance-authority";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ComponentType,
  SVGProps,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Circular "bubble" control used for the carousel arrows (48, outline),
 * social links (36: dark on cards, white on the photo card, tinted in the
 * footer) and the mobile menu toggle (32, plain).
 *
 * Self-designed states, shared by every circular control so they behave the
 * same: hover = bubble pop (scale 1.08) + fill, pressed = scale 0.94,
 * focus = global ring, disabled = 40% opacity (carousel ends only).
 */
export const iconButtonVariants = cva(
  [
    "group/icon inline-flex shrink-0 items-center justify-center rounded-full",
    "transition-[scale,background-color,color] duration-(--duration-base) ease-standard",
    "not-disabled:hover:scale-[1.08] not-disabled:active:scale-[0.94]",
    "disabled:cursor-not-allowed disabled:opacity-40",
  ],
  {
    variants: {
      tone: {
        /** Carousel arrows: the icon draws its own ring; hover fills it. */
        outline: "text-primary not-disabled:hover:bg-selected",
        /** Social links on light cards. */
        solid: "bg-primary text-white not-disabled:hover:bg-brand-800",
        /** Social links on the photo testimonial card. */
        inverse: "bg-white text-primary not-disabled:hover:bg-off-white",
        /** Footer social links on the dark footer. */
        footer: "bg-brand-800 text-off-white not-disabled:hover:bg-sage-500",
        /** Menu toggle: icon only. */
        plain: "text-primary not-disabled:hover:bg-selected",
      },
      size: {
        lg: "size-12", // 48
        md: "size-9", // 36
        sm: "size-8", // 32
      },
    },
    defaultVariants: { tone: "outline", size: "lg" },
  },
);

/** Icon size inside the circle, per control size. */
const iconSize = {
  // Outline/plain icons fill the control (the glyph has its own ring).
  ring: { lg: "size-12", md: "size-9", sm: "size-8" },
  // Solid/inverse/footer circles have a 6px inset around a 24px glyph.
  glyph: { lg: "size-7", md: "size-6", sm: "size-5" },
} as const;

type Variants = VariantProps<typeof iconButtonVariants>;

type SharedProps = Variants & {
  /** Accessible name; the icon itself is decorative. */
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** e.g. `rotate-180` to turn the right arrow into "previous". */
  iconClassName?: string;
};

function Glyph({
  icon: Icon,
  tone,
  size,
  iconClassName,
}: Pick<SharedProps, "icon" | "tone" | "size" | "iconClassName">) {
  const fill = tone === "outline" || tone === "plain" ? "ring" : "glyph";
  return <Icon className={cn(iconSize[fill][size ?? "lg"], iconClassName)} />;
}

export type IconButtonProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export function IconButton({
  label,
  icon,
  iconClassName,
  tone = "outline",
  size = "lg",
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(iconButtonVariants({ tone, size }), className)}
      {...props}
    >
      <Glyph
        icon={icon}
        tone={tone}
        size={size}
        iconClassName={iconClassName}
      />
    </button>
  );
}

export type IconLinkProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
    href: string;
  };

/** Same look as IconButton, rendered as a link (social profiles). */
export function IconLink({
  label,
  icon,
  iconClassName,
  tone = "solid",
  size = "md",
  className,
  href,
  ...props
}: IconLinkProps) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      aria-label={label}
      className={cn(iconButtonVariants({ tone, size }), className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      <Glyph
        icon={icon}
        tone={tone}
        size={size}
        iconClassName={iconClassName}
      />
    </a>
  );
}
