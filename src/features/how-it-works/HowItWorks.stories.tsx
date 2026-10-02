import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { homeContent } from "@/content/mock";
import { HowItWorks } from "./HowItWorks";
import { toHowItWorksProps } from "./to-how-it-works-props";

const meta = {
  title: "Sections/HowItWorks",
  component: HowItWorks,
  args: toHowItWorksProps(homeContent),
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HowItWorks>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Static section: no interaction states. */
export const Desktop: Story = {
  globals: { viewport: { value: "board1440", isRotated: false } },
};
export const Mobile: Story = {
  globals: { viewport: { value: "board375", isRotated: false } },
};
