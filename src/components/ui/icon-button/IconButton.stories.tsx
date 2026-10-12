import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  ArrowRightCircleIcon,
  MenuIcon,
  SocialFacebookIcon,
  SocialInstagramIcon,
  SocialLinkedinIcon,
  SocialLinkedinOutlineIcon,
  SocialXIcon,
} from "@/components/icons";
import { IconButton, IconLink } from "./IconButton";

const meta = {
  title: "UI/IconButton",
  component: IconButton,
  parameters: { layout: "centered" },
  args: {
    label: "Next slide",
    icon: ArrowRightCircleIcon,
    tone: "outline",
    size: "lg",
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---- Carousel arrow (outline, 48) — the only icon button with a disabled state
export const CarouselNext: Story = {};
export const CarouselNextHover: Story = {
  parameters: { pseudo: { hover: true } },
};
export const CarouselNextFocus: Story = {
  parameters: { pseudo: { focusVisible: true } },
};
export const CarouselNextPressed: Story = {
  parameters: { pseudo: { active: true } },
};
/** At the first card "previous" is disabled (and the last card disables "next"). */
export const CarouselPreviousDisabled: Story = {
  args: {
    label: "Previous slide",
    iconClassName: "rotate-180",
    disabled: true,
  },
};
export const CarouselPreviousDisabledHover: Story = {
  ...CarouselPreviousDisabled,
  parameters: { pseudo: { hover: true } },
};

// ---- Menu toggle (plain, 32) ---------------------------------------------
export const MenuToggle: Story = {
  args: { label: "Open menu", icon: MenuIcon, tone: "plain", size: "sm" },
};
export const MenuToggleHover: Story = {
  ...MenuToggle,
  parameters: { pseudo: { hover: true } },
};

// ---- Social links (IconLink, 36) -------------------------------------------
const socialRow = (tone: "solid" | "inverse" | "footer") => {
  const linkedin =
    tone === "footer" ? SocialLinkedinOutlineIcon : SocialLinkedinIcon;
  return (
    <div className="flex gap-2">
      <IconLink
        tone={tone}
        label="Apsu on X"
        icon={SocialXIcon}
        href="https://x.com"
      />
      {tone === "footer" ? (
        <IconLink
          tone={tone}
          label="Apsu on Facebook"
          icon={SocialFacebookIcon}
          href="https://www.facebook.com"
        />
      ) : null}
      <IconLink
        tone={tone}
        label="Apsu on Instagram"
        icon={SocialInstagramIcon}
        href="https://www.instagram.com"
      />
      <IconLink
        tone={tone}
        label="Apsu on LinkedIn"
        icon={linkedin}
        href="https://www.linkedin.com"
      />
    </div>
  );
};

/** Testimonial cards (light background). */
export const SocialSolid: Story = {
  render: () => (
    <div className="rounded-card bg-off-white p-6">{socialRow("solid")}</div>
  ),
};
export const SocialSolidHover: Story = {
  ...SocialSolid,
  parameters: { pseudo: { hover: true } },
};
export const SocialSolidFocus: Story = {
  ...SocialSolid,
  parameters: { pseudo: { focusVisible: true } },
};
export const SocialSolidPressed: Story = {
  ...SocialSolid,
  parameters: { pseudo: { active: true } },
};

/** Photo testimonial card (white circles on the dark gradient). */
export const SocialInverse: Story = {
  render: () => (
    <div className="rounded-card bg-brand-900 p-6">{socialRow("inverse")}</div>
  ),
};
export const SocialInverseHover: Story = {
  ...SocialInverse,
  parameters: { pseudo: { hover: true } },
};

/** Footer (tinted circles on the dark footer, includes Facebook). */
export const SocialFooter: Story = {
  render: () => (
    <div className="rounded-card bg-brand-900 p-6">{socialRow("footer")}</div>
  ),
};
export const SocialFooterHover: Story = {
  ...SocialFooter,
  parameters: { pseudo: { hover: true } },
};
