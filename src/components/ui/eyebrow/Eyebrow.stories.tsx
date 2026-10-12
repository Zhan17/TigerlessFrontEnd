import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Eyebrow } from "./Eyebrow";

const meta = {
  title: "UI/Eyebrow",
  component: Eyebrow,
  args: { children: "How it works" },
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Section eyebrow (green). Static component: no interaction states. */
export const Accent: Story = {};

/** Hero category card eyebrow (dark, slightly larger on desktop). */
export const HeadingLarge: Story = {
  args: { tone: "heading", size: "lg", children: "Weight management" },
};
