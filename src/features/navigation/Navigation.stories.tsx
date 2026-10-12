import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { homeContent, programs } from "@/content/mock";
import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./NavLink";
import { SiteHeader } from "./SiteHeader";
import { toNavigationProps } from "./to-navigation-props";

const props = toNavigationProps(homeContent, programs);

const meta = {
  title: "Sections/Navigation",
  component: SiteHeader,
  args: props,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Desktop board: logo, centred links, Get started + Login. */
export const Desktop: Story = {
  globals: { viewport: { value: "board1440", isRotated: false } },
};

/** Below the 70rem nav breakpoint the links collapse into the menu button. */
export const Mobile: Story = {
  globals: { viewport: { value: "board375", isRotated: false } },
};

/** Mobile menu, open (circular reveal from the menu button). */
export const MobileMenuOpen: Story = {
  globals: { viewport: { value: "board375", isRotated: false } },
  render: (args) => (
    <div className="p-5">
      <MobileMenu {...args} defaultOpen />
    </div>
  ),
};

// ---- Nav link states --------------------------------------------------
const linkItem = props.items[0];
const LinkStory: Story = {
  render: () => (linkItem ? <NavLink item={linkItem} /> : <span />),
  parameters: { layout: "centered" },
};

export const LinkDefault: Story = { ...LinkStory };
export const LinkHover: Story = {
  ...LinkStory,
  parameters: { ...LinkStory.parameters, pseudo: { hover: true } },
};
export const LinkFocus: Story = {
  ...LinkStory,
  parameters: { ...LinkStory.parameters, pseudo: { focusVisible: true } },
};
export const LinkPressed: Story = {
  ...LinkStory,
  parameters: { ...LinkStory.parameters, pseudo: { active: true } },
};
/** The section currently in view (scroll-spy). */
export const LinkCurrentSection: Story = {
  render: () => (linkItem ? <NavLink item={linkItem} active /> : <span />),
  parameters: { layout: "centered" },
};

/** Logo link (back to the top): hover / pressed / focus. */
const logo = 'a[aria-label="Apsu home"]';
export const LogoHover: Story = {
  ...Desktop,
  parameters: { ...Desktop.parameters, pseudo: { hover: [logo] } },
};
export const LogoPressed: Story = {
  ...Desktop,
  parameters: { ...Desktop.parameters, pseudo: { active: [logo] } },
};
export const LogoFocus: Story = {
  ...Desktop,
  parameters: { ...Desktop.parameters, pseudo: { focusVisible: [logo] } },
};
