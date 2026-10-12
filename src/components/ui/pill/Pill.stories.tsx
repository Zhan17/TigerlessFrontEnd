import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pill } from "./Pill";

const meta = {
  title: "UI/Pill",
  component: Pill,
  parameters: { layout: "centered" },
  args: { children: "English", selected: false },
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = { parameters: { pseudo: { hover: true } } };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } } };
export const Pressed: Story = { parameters: { pseudo: { active: true } } };

/** After a click: the design's light-green fill. */
export const Selected: Story = {
  args: { selected: true, children: "中文", lang: "zh" },
};
export const SelectedHover: Story = {
  ...Selected,
  parameters: { pseudo: { hover: true } },
};

/** Right-to-left script: lang/dir make it render and read correctly. */
export const RightToLeft: Story = {
  args: { children: "العربية", lang: "ar", dir: "rtl" },
};
