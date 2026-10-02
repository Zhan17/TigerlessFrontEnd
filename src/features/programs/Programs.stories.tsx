import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { homeContent, products, programs } from "@/content/mock";
import { ProductCard } from "./ProductCard";
import { ProgramSection } from "./ProgramSection";
import { toProgramSectionsProps } from "./to-programs-props";

const sections = toProgramSectionsProps(homeContent, programs, products);
const weightLoss = sections.find((s) => s.id === "weight-loss");
if (!weightLoss) throw new Error("mock content must include weight loss");

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
