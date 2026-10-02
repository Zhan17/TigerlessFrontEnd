import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { homeContent } from "@/content/mock";
import { BmiCalculator } from "./BmiCalculator";
import { toBmiProps } from "./to-bmi-props";

const { programId: _programId, ...props } = toBmiProps(homeContent);

const imperial = (heightFt: string, heightIn: string, weight: string) => ({
  unit: "imperial" as const,
  heightFt,
  heightIn,
  heightCm: "",
  weight,
});

const meta = {
  title: "Sections/BMI calculator",
  component: BmiCalculator,
  args: props,
  parameters: { layout: "fullscreen" },
  globals: { viewport: { value: "board1440", isRotated: false } },
  decorators: [
    (Story) => (
      <div className="px-gutter py-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BmiCalculator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** C9: empty inputs, "—" score, Calculate disabled until the input is valid. */
export const Initial: Story = {};

/** Valid input, not yet calculated: the button is enabled. */
export const ReadyToCalculate: Story = {
  args: { defaultInput: imperial("5", "7", "150") },
};

/** Out-of-range value: message under the field, button stays disabled. */
export const InvalidInput: Story = {
  args: { defaultInput: imperial("12", "0", "150") },
};

export const ResultHealthyWoman: Story = {
  args: { defaultInput: imperial("5", "7", "150"), defaultCalculated: true },
};

/** C6: the sentence names the chosen sex; the number is the same. */
export const ResultHealthyMan: Story = {
  args: {
    defaultInput: imperial("5", "7", "150"),
    defaultSex: "male",
    defaultCalculated: true,
  },
};

export const ResultUnderweight: Story = {
  args: { defaultInput: imperial("5", "9", "115"), defaultCalculated: true },
};

export const ResultOverweight: Story = {
  args: { defaultInput: imperial("5", "9", "180"), defaultCalculated: true },
};

export const ResultObese: Story = {
  args: { defaultInput: imperial("5", "4", "190"), defaultCalculated: true },
};

/** Metric units (cm / kg). */
export const MetricResult: Story = {
  args: {
    defaultInput: {
      unit: "metric",
      heightFt: "",
      heightIn: "",
      heightCm: "180",
      weight: "90",
    },
    defaultCalculated: true,
  },
};

/** Mobile board: one card, gauge on top, result sentence under the button. */
export const MobileInitial: Story = {
  globals: { viewport: { value: "board375", isRotated: false } },
};
export const MobileResult: Story = {
  ...ResultHealthyWoman,
  globals: { viewport: { value: "board375", isRotated: false } },
};

/** Hover / pressed on Calculate (same Button states as elsewhere). */
export const CalculateHover: Story = {
  ...ReadyToCalculate,
  parameters: { pseudo: { hover: ["button[type=submit]"] } },
};
export const CalculatePressed: Story = {
  ...ReadyToCalculate,
  parameters: { pseudo: { active: ["button[type=submit]"] } },
};
