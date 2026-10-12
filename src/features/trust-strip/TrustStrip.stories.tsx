import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { homeContent } from "@/content/mock";
import { TrustStrip } from "./TrustStrip";

const meta = {
  title: "Sections/TrustStrip",
  component: TrustStrip,
  args: { items: homeContent.trustStrip.items },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TrustStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Scrolls left continuously (CSS marquee). */
export const Default: Story = {};
/** Self-designed: hovering pauses the scroll. */
export const HoverPaused: Story = { parameters: { pseudo: { hover: true } } };
export const Mobile: Story = {
  globals: { viewport: { value: "board375", isRotated: false } },
};
