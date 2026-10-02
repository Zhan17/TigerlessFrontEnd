import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { homeContent, programs } from "@/content/mock";
import { ClosingCta } from "./ClosingCta";
import { SiteFooter } from "./SiteFooter";
import { toClosingCtaProps, toFooterProps } from "./to-footer-props";

const cta = toClosingCtaProps(homeContent);
const footer = toFooterProps(homeContent, programs, 2026);

const meta = {
  title: "Sections/Footer",
  component: SiteFooter,
  args: footer,
  parameters: { layout: "fullscreen" },
  globals: { viewport: { value: "board1440", isRotated: false } },
  decorators: [
    (Story) => (
      <div className="bg-page pt-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Closing CTA + footer, as they appear at the end of the page. */
export const WithClosingCta: Story = {
  render: (args) => (
    <>
      <ClosingCta {...cta} />
      <SiteFooter {...args} />
    </>
  ),
};
export const WithClosingCtaMobile: Story = {
  ...WithClosingCta,
  globals: { viewport: { value: "board375", isRotated: false } },
};
export const FooterOnly: Story = {};

/** Link and social states on the dark background. */
export const LinkHover: Story = {
  parameters: { pseudo: { hover: ["nav a"] } },
};
export const LinkPressed: Story = {
  parameters: { pseudo: { active: ["nav a"] } },
};
export const SocialHover: Story = {
  parameters: { pseudo: { hover: ["ul a"] } },
};

/** Closing CTA button states. */
export const CtaButtonHover: Story = {
  ...WithClosingCta,
  parameters: { pseudo: { hover: ["section button"] } },
};
export const CtaButtonPressed: Story = {
  ...WithClosingCta,
  parameters: { pseudo: { active: ["section button"] } },
};

/** Footer logo link (back to the top): hover / pressed / focus. */
const logo = 'a[aria-label="Apsu home"]';
export const LogoHover: Story = {
  parameters: { pseudo: { hover: [logo] } },
};
export const LogoPressed: Story = {
  parameters: { pseudo: { active: [logo] } },
};
export const LogoFocus: Story = {
  parameters: { pseudo: { focusVisible: [logo] } },
};
