import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Rating } from "./Rating";

const meta = {
  title: "UI/Rating",
  component: Rating,
  args: { value: 5 },
  argTypes: { value: { control: { type: "range", min: 0, max: 5, step: 1 } } },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

/** All testimonials in the design are 5/5. Static: no interaction states. */
export const FiveStars: Story = {};

/** Data may carry lower ratings; unfilled stars use the border colour. */
export const ThreeStars: Story = { args: { value: 3 } };
