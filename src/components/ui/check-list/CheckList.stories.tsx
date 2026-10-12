import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CheckList } from "./CheckList";

const meta = {
  title: "UI/CheckList",
  component: CheckList,
  args: {
    items: [
      "Same-day doctor visits and prescriptions",
      "Dosage personalized",
      "Shipped from licensed USA pharmacies",
    ],
  },
} satisfies Meta<typeof CheckList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Static component: no interaction states. */
export const Default: Story = {};

/** Long items wrap; the icon stays aligned with the first line. */
export const NarrowWrapping: Story = {
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};
