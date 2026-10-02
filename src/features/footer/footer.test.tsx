import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { homeContent, programs } from "@/content/mock";
import { ClosingCta } from "./ClosingCta";
import { SiteFooter } from "./SiteFooter";
import { toClosingCtaProps, toFooterProps } from "./to-footer-props";

describe("ClosingCta", () => {
  it("uses the shared CTA label (F11) and lists the points", () => {
    render(<ClosingCta {...toClosingCtaProps(homeContent)} />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Ready For Healthcare In Your Language?",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Start a free consultation" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(
      ["No Appointment Needed", "No Insurance Required"],
    );
  });
});

describe("toFooterProps", () => {
  const props = toFooterProps(homeContent, programs, 2026);

  it("names program links after the programs and anchors them", () => {
    expect(props.columns[0]?.items.map((item) => item.label)).toEqual([
      "Weight Loss",
      "Birth Control",
      "Sleep",
    ]);
    expect(props.columns[0]?.items[0]?.link).toEqual({
      type: "anchor",
      target: "weight-loss",
    });
  });

  it("builds the copyright line and social labels", () => {
    expect(props.copyright).toBe("© 2026 APSU. All rights reserved.");
    expect(props.socials.map((s) => s.label)).toEqual([
      "APSU on X",
      "APSU on Facebook",
      "APSU on Instagram",
      "APSU on LinkedIn",
    ]);
  });
});

describe("SiteFooter", () => {
  it("renders the footer navigation with the F02 heading and the FAQ anchor", () => {
    render(<SiteFooter {...toFooterProps(homeContent, programs, 2026)} />);
    const nav = screen.getByRole("navigation", { name: "Footer" });
    expect(
      within(nav).getByRole("heading", { name: "Company" }),
    ).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "FAQs" })).toHaveAttribute(
      "href",
      "#faq",
    );
    expect(
      screen.getByText("© 2026 APSU. All rights reserved."),
    ).toBeInTheDocument();
  });
});
