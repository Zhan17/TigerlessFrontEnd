import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Price } from "./Price";

const meta = {
  title: "UI/Price",
  component: Price,
  args: { amountMinor: 2000, currency: "USD", interval: "month", size: "lg" },
} satisfies Meta<typeof Price>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Program sections (birth control, sleep). Static: no interaction states. */
export const Program: Story = {};

/** Weight-loss product cards. */
export const ProductCard: Story = { args: { amountMinor: 20000, size: "sm" } };

/** Non-whole amounts keep cents. */
export const WithCents: Story = { args: { amountMinor: 1999 } };
