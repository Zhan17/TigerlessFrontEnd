import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { homeContent } from "@/content/mock";
import { BmiCalculator } from "./BmiCalculator";
import { toBmiProps } from "./to-bmi-props";

const { programId, ...props } = toBmiProps(homeContent);

describe("toBmiProps", () => {
  it("reads the host program and copy from content", () => {
    expect(programId).toBe("weight-loss");
    expect(props.heading).toBe("Could a GLP-1 program be right for you?");
  });
});

describe("BmiCalculator", () => {
  it("enables Calculate only for valid input and shows the C6 sentence", async () => {
    const user = userEvent.setup();
    render(<BmiCalculator {...props} />);
    const form = screen.getByRole("form", { name: props.heading });
    const submit = within(form).getByRole("button", { name: "Calculate BMI" });
    expect(submit).toBeDisabled();

    await user.type(
      within(form).getByRole("spinbutton", { name: "Height, feet" }),
      "5",
    );
    await user.type(
      within(form).getByRole("spinbutton", { name: "Height, inches" }),
      "7",
    );
    await user.type(
      within(form).getByRole("spinbutton", { name: "Weight, pounds" }),
      "150",
    );
    expect(submit).toBeEnabled();
    await user.click(submit);

    expect(
      screen.getAllByText("As a woman, your BMI is 23.5 — Healthy Weight.")
        .length,
    ).toBeGreaterThan(0);
  });

  it("converts typed values when switching units", async () => {
    const user = userEvent.setup();
    render(
      <BmiCalculator
        {...props}
        defaultInput={{
          unit: "imperial",
          heightFt: "6",
          heightIn: "0",
          heightCm: "",
          weight: "176",
        }}
      />,
    );
    await user.click(screen.getByText("cm / kg"));
    expect(
      screen.getByRole("spinbutton", { name: "Height, centimetres" }),
    ).toHaveValue(182.9);
    expect(
      screen.getByRole("spinbutton", { name: "Weight, kilograms" }),
    ).toHaveValue(79.8);
  });

  it("labels the legend from the thresholds (F08)", () => {
    render(<BmiCalculator {...props} />);
    expect(screen.getByText("18.5–24.9")).toBeInTheDocument();
    expect(screen.getByText("25–29.9")).toBeInTheDocument();
  });
});
