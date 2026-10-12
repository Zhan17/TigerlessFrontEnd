import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { NumberField } from "./number-field";
import { RadioPill } from "./radio-pill";
import { SegmentedControl } from "./segmented-control";

/** Form controls used by the BMI calculator (one story per state). */
const meta = {
  title: "UI/Form controls",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---- SegmentedControl --------------------------------------------------
function Units({ initial = "imperial" }: { initial?: "imperial" | "metric" }) {
  const [value, setValue] = useState(initial);
  return (
    <SegmentedControl
      label="Units"
      value={value}
      onChange={setValue}
      options={[
        { value: "imperial", label: "ft / lbs" },
        { value: "metric", label: "cm / kg" },
      ]}
    />
  );
}

/** Click the other option: the pill slides with a liquid squash. */
export const SegmentedDefault: Story = { render: () => <Units /> };
export const SegmentedSecondSelected: Story = {
  render: () => <Units initial="metric" />,
};
export const SegmentedHover: Story = {
  render: () => <Units />,
  parameters: { pseudo: { hover: ["label:nth-of-type(2)"] } },
};
/** Pressing the inactive option: its label shrinks slightly. */
export const SegmentedPressed: Story = {
  render: () => <Units />,
  parameters: { pseudo: { active: ["label:nth-of-type(2)"] } },
};
export const SegmentedFocus: Story = {
  render: () => <Units />,
  parameters: { pseudo: { focusVisible: ["input"] } },
};

// ---- NumberField -------------------------------------------------------
function Field(props: { initial?: string; error?: string }) {
  const [value, setValue] = useState(props.initial ?? "");
  return (
    <div className="w-60">
      <NumberField
        label="Height in feet"
        unit="ft"
        value={value}
        onChange={setValue}
        min={3}
        max={8}
        placeholder="0"
        error={props.error}
        incrementLabel="Increase feet"
        decrementLabel="Decrease feet"
      />
    </div>
  );
}

export const NumberEmpty: Story = { render: () => <Field /> };
export const NumberFilled: Story = { render: () => <Field initial="5" /> };
export const NumberHover: Story = {
  render: () => <Field initial="5" />,
  parameters: { pseudo: { hover: true } },
};
/** Pressing the stepper halves: the pressed half darkens. */
export const NumberIncrementPressed: Story = {
  render: () => <Field initial="5" />,
  parameters: { pseudo: { active: ['button[aria-label^="Increase"]'] } },
};
export const NumberDecrementPressed: Story = {
  render: () => <Field initial="5" />,
  parameters: { pseudo: { active: ['button[aria-label^="Decrease"]'] } },
};
export const NumberFocus: Story = {
  render: () => <Field initial="5" />,
  parameters: { pseudo: { focusVisible: ["input"] } },
};
export const NumberInvalid: Story = {
  render: () => <Field initial="12" error="Enter 3–8 ft" />,
};

// ---- RadioPill ---------------------------------------------------------
function Sex({ initial = "female" }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <fieldset className="flex gap-3">
      <legend className="sr-only">Sex</legend>
      {["male", "female"].map((option) => (
        <RadioPill
          key={option}
          name="sex-story"
          value={option}
          checked={value === option}
          onChange={() => setValue(option)}
          className="w-32"
        >
          {option === "male" ? "Male" : "Female"}
        </RadioPill>
      ))}
    </fieldset>
  );
}

export const RadioDefault: Story = { render: () => <Sex /> };
export const RadioHover: Story = {
  render: () => <Sex />,
  parameters: { pseudo: { hover: ["label:first-of-type"] } },
};
/** Pressing an option: it shrinks slightly. */
export const RadioPressed: Story = {
  render: () => <Sex />,
  parameters: { pseudo: { active: ["label:first-of-type"] } },
};
export const RadioFocus: Story = {
  render: () => <Sex />,
  parameters: { pseudo: { focusVisible: ["input"] } },
};
export const RadioOtherChecked: Story = {
  render: () => <Sex initial="male" />,
};
