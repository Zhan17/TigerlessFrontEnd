import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { type SocialLink, SocialLinks } from "./SocialLinks";

// Placeholder targets: the platforms' official sites (decision Q5).
const cardLinks: SocialLink[] = [
  { platform: "x", href: "https://x.com", label: "Maria R. on X" },
  {
    platform: "instagram",
    href: "https://www.instagram.com",
    label: "Maria R. on Instagram",
  },
  {
    platform: "linkedin",
    href: "https://www.linkedin.com",
    label: "Maria R. on LinkedIn",
  },
];

const footerLinks: SocialLink[] = [
  { platform: "x", href: "https://x.com", label: "Apsu on X" },
  {
    platform: "facebook",
    href: "https://www.facebook.com",
    label: "Apsu on Facebook",
  },
  {
    platform: "instagram",
    href: "https://www.instagram.com",
    label: "Apsu on Instagram",
  },
  {
    platform: "linkedin",
    href: "https://www.linkedin.com",
    label: "Apsu on LinkedIn",
  },
];

const meta = {
  title: "UI/SocialLinks",
  component: SocialLinks,
  args: { links: cardLinks, tone: "solid" },
} satisfies Meta<typeof SocialLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Composition of IconLink: per-link hover / focus / pressed states are the
 * IconButton stories. Here: one story per placement.
 */
export const OnCard: Story = {
  decorators: [
    (Story) => (
      <div className="rounded-card bg-off-white p-6">
        <Story />
      </div>
    ),
  ],
};
export const OnPhoto: Story = {
  args: { tone: "inverse" },
  decorators: [
    (Story) => (
      <div className="rounded-card bg-brand-900 p-6">
        <Story />
      </div>
    ),
  ],
};
export const Footer: Story = {
  args: { tone: "footer", links: footerLinks },
  decorators: [
    (Story) => (
      <div className="rounded-card bg-brand-900 p-6">
        <Story />
      </div>
    ),
  ],
};
