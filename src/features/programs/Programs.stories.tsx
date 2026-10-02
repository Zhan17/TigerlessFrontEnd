import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { homeContent, products, programs } from "@/content/mock";
import { HighlightCards } from "./HighlightCards";
import { ProductCard } from "./ProductCard";
import { ProgramSection } from "./ProgramSection";
import { toProgramSectionsProps } from "./to-programs-props";

const sections = toProgramSectionsProps(homeContent, programs, products);
const weightLoss = sections.find((s) => s.id === "weight-loss");
const birthControl = sections.find((s) => s.id === "birth-control");
const sleep = sections.find((s) => s.id === "sleep");
if (!weightLoss || !birthControl || !sleep)
  throw new Error("mock content must include all three programs");

const meta = {
  title: "Sections/Programs",
  component: ProgramSection,
  args: weightLoss,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="py-24">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgramSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Weight loss: feature card + product cards (interactive parts are buttons). */
export const WeightLossDesktop: Story = {
  globals: { viewport: { value: "board1440", isRotated: false } },
};
export const WeightLossMobile: Story = {
  globals: { viewport: { value: "board375", isRotated: false } },
};

/** Birth control: starting price instead of products, photo on the right. */
export const BirthControlDesktop: Story = {
  args: birthControl,
  globals: { viewport: { value: "board1440", isRotated: false } },
};
/** Mobile shows the intro paragraph too (the board drops it; see README). */
export const BirthControlMobile: Story = {
  args: birthControl,
  globals: { viewport: { value: "board375", isRotated: false } },
};

/** Sleep: photo on the left with the floating highlight cards. */
export const SleepDesktop: Story = {
  args: sleep,
  globals: { viewport: { value: "board1440", isRotated: false } },
};
export const SleepMobile: Story = {
  args: sleep,
  globals: { viewport: { value: "board375", isRotated: false } },
};
/** 320px: the cards shrink and the metrics wrap instead of overflowing. */
export const SleepNarrow: Story = {
  args: sleep,
  globals: { viewport: { value: "narrow320", isRotated: false } },
};

/** The stat cards on their own (decorative, no interaction states). */
export const HighlightCardsOnly: Story = {
  render: () => (
    <div className="flex justify-center bg-card-blue p-10">
      <HighlightCards cards={sleep.highlights} />
    </div>
  ),
};

const product = weightLoss.products[0];
export const ProductCardDefault: Story = {
  render: () => (
    <div className="mx-auto w-[40rem] px-4">
      {product ? <ProductCard {...product} /> : null}
    </div>
  ),
};
/** Hover / focus / pressed live on the button (see UI/Button). */
export const ProductCardButtonHover: Story = {
  ...ProductCardDefault,
  parameters: { pseudo: { hover: ["button"] } },
};
