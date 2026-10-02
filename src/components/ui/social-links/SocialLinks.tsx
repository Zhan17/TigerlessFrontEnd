import type { ComponentType, SVGProps } from "react";
import {
  SocialFacebookIcon,
  SocialInstagramIcon,
  SocialLinkedinIcon,
  SocialLinkedinOutlineIcon,
  SocialXIcon,
} from "@/components/icons";
import { IconLink } from "@/components/ui/icon-button";
import { cn } from "@/lib/cn";

export type SocialPlatform = "x" | "instagram" | "linkedin" | "facebook";

export type SocialLink = {
  platform: SocialPlatform;
  href: string;
  /** Accessible name, e.g. "Apsu on Instagram". */
  label: string;
};

type Tone = "solid" | "inverse" | "footer";
type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const icons: Record<SocialPlatform, Icon> = {
  x: SocialXIcon,
  instagram: SocialInstagramIcon,
  linkedin: SocialLinkedinIcon,
  facebook: SocialFacebookIcon,
};

// The footer uses the outlined LinkedIn mark; cards use the bold "in".
const footerIcons: Partial<Record<SocialPlatform, Icon>> = {
  linkedin: SocialLinkedinOutlineIcon,
};

export type SocialLinksProps = {
  links: readonly SocialLink[];
  tone?: Tone;
  className?: string;
};

/** Row of circular social links (testimonial cards and footer). */
export function SocialLinks({
  links,
  tone = "solid",
  className,
}: SocialLinksProps) {
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {links.map((link) => (
        <li key={`${link.platform}-${link.href}`}>
          <IconLink
            tone={tone}
            size="md"
            href={link.href}
            label={link.label}
            icon={
              (tone === "footer" ? footerIcons[link.platform] : undefined) ??
              icons[link.platform]
            }
          />
        </li>
      ))}
    </ul>
  );
}
