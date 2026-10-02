import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CheckList } from "./check-list";
import { Eyebrow } from "./eyebrow";
import { Price } from "./price";
import { Rating } from "./rating";

describe("content primitives", () => {
  it("Eyebrow renders its text", () => {
    render(<Eyebrow>How it works</Eyebrow>);
    expect(screen.getByText("How it works")).toBeInTheDocument();
  });

  it("CheckList renders a semantic list", () => {
    render(
      <CheckList items={["Prescriptions.", "Complex symptom evaluation."]} />,
    );
    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
  });

  it("Price formats minor units with the interval suffix", () => {
    const { container } = render(
      <Price amountMinor={20000} currency="USD" interval="month" />,
    );
    expect(container.textContent).toBe("From $200/mo");
  });

  it("Rating exposes one accessible label and clamps the value", () => {
    render(<Rating value={7} />);
    expect(
      screen.getByRole("img", { name: "Rated 5 out of 5" }),
    ).toBeInTheDocument();
  });
});
