import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { NumberField } from "./number-field";
import { RadioPill } from "./radio-pill";
import { SegmentedControl } from "./segmented-control";

function Units() {
  const [value, setValue] = useState<"imperial" | "metric">("imperial");
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

describe("SegmentedControl", () => {
  it("is a radio group that changes on click and with arrow keys", async () => {
    const user = userEvent.setup();
    render(<Units />);
    expect(screen.getByRole("group", { name: "Units" })).toBeInTheDocument();
    const imperial = screen.getByRole("radio", { name: "ft / lbs" });
    const metric = screen.getByRole("radio", { name: "cm / kg" });
    expect(imperial).toBeChecked();
    await user.click(screen.getByText("cm / kg"));
    expect(metric).toBeChecked();
    await user.keyboard("{ArrowLeft}");
    expect(imperial).toBeChecked();
  });
});

function Field({ initial = "" }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <NumberField
      label="Weight"
      unit="lbs"
      value={value}
      onChange={setValue}
      min={45}
      max={700}
      incrementLabel="Increase weight"
      decrementLabel="Decrease weight"
    />
  );
}

describe("NumberField", () => {
  it("accepts typing and steps with the buttons within bounds", async () => {
    const user = userEvent.setup();
    render(<Field initial="699" />);
    const input = screen.getByRole("spinbutton", { name: "Weight" });
    await user.click(screen.getByRole("button", { name: "Increase weight" }));
    await user.click(screen.getByRole("button", { name: "Increase weight" }));
    expect(input).toHaveValue(700);
    await user.clear(input);
    await user.type(input, "150");
    expect(input).toHaveValue(150);
  });

  it("starts from the minimum when empty", async () => {
    const user = userEvent.setup();
    render(<Field />);
    await user.click(screen.getByRole("button", { name: "Decrease weight" }));
    expect(screen.getByRole("spinbutton", { name: "Weight" })).toHaveValue(45);
  });

  // R11: a step that cannot move the value the way the button points must
  // not change it (e.g. 11.5 in with max 11: "increase" used to clamp it
  // down to 11), and a step that changes nothing must not report a change.
  it("never steps against its direction or reports a no-op change", async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    const { rerender } = render(
      <NumberField
        label="Inches"
        unit="in"
        value="11.5"
        onChange={(next) => calls.push(next)}
        min={0}
        max={11}
        incrementLabel="Increase inches"
        decrementLabel="Decrease inches"
      />,
    );
    await user.click(screen.getByRole("button", { name: "Increase inches" }));
    rerender(
      <NumberField
        label="Inches"
        unit="in"
        value="11"
        onChange={(next) => calls.push(next)}
        min={0}
        max={11}
        incrementLabel="Increase inches"
        decrementLabel="Decrease inches"
      />,
    );
    await user.click(screen.getByRole("button", { name: "Increase inches" }));
    expect(calls).toEqual([]);
    // Normal steps still work, including from a decimal.
    await user.click(screen.getByRole("button", { name: "Decrease inches" }));
    expect(calls).toEqual(["10"]);
  });

  it("applies the same rules to the arrow keys", async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    render(
      <NumberField
        label="Inches"
        unit="in"
        value="11.5"
        onChange={(next) => calls.push(next)}
        min={0}
        max={11}
        incrementLabel="Increase inches"
        decrementLabel="Decrease inches"
      />,
    );
    const input = screen.getByRole("spinbutton", { name: "Inches" });
    input.focus();
    await user.keyboard("{ArrowUp}");
    expect(calls).toEqual([]);
    await user.keyboard("{ArrowDown}");
    expect(calls).toEqual(["10.5"]);
  });

  it("announces errors", () => {
    render(
      <NumberField
        label="Height"
        unit="cm"
        value="40"
        onChange={() => {}}
        error="Enter 90–250 cm"
        incrementLabel="+"
        decrementLabel="-"
      />,
    );
    const input = screen.getByRole("spinbutton", { name: "Height" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Enter 90–250 cm");
  });
});

describe("RadioPill", () => {
  it("behaves as a native radio", async () => {
    const user = userEvent.setup();
    function Sex() {
      const [value, setValue] = useState("female");
      return (
        <fieldset>
          <legend>Sex</legend>
          {["male", "female"].map((option) => (
            <RadioPill
              key={option}
              name="sex"
              value={option}
              checked={value === option}
              onChange={() => setValue(option)}
            >
              {option}
            </RadioPill>
          ))}
        </fieldset>
      );
    }
    render(<Sex />);
    expect(screen.getByRole("radio", { name: "female" })).toBeChecked();
    await user.click(screen.getByText("male"));
    expect(screen.getByRole("radio", { name: "male" })).toBeChecked();
  });
});
