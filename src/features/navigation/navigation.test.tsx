import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { homeContent, programs } from "@/content/mock";
import { MobileMenu } from "./MobileMenu";
import { SiteHeader } from "./SiteHeader";
import { toNavigationProps } from "./to-navigation-props";

const props = toNavigationProps(homeContent, programs);

describe("toNavigationProps", () => {
  it("labels program items with the program name and links to its section", () => {
    expect(props.items.map((item) => item.label)).toEqual([
      "Weight Loss",
      "Birth Control",
      "Sleep",
      "Contact Us",
    ]);
    expect(props.items[0]?.link).toEqual({
      type: "anchor",
      target: "weight-loss",
    });
  });

  it("skips references to missing programs", () => {
    const result = toNavigationProps(homeContent, programs.slice(1));
    expect(result.items.map((item) => item.label)).not.toContain("Weight Loss");
  });

  it("resolves the shared CTAs", () => {
    expect(props.ctas.map((cta) => cta.label)).toEqual([
      "Get started",
      "Login",
    ]);
  });
});

describe("SiteHeader", () => {
  it("renders a labelled main navigation with every item", () => {
    render(<SiteHeader {...props} />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Weight Loss" })).toHaveAttribute(
      "href",
      "#weight-loss",
    );
    // "Contact Us" has no destination: a button with press feedback only.
    expect(
      screen.getByRole("button", { name: "Contact Us" }),
    ).toBeInTheDocument();
  });

  it("does not mark items without a section as current", () => {
    render(<SiteHeader {...props} />);
    expect(
      screen.getByRole("button", { name: "Contact Us" }),
    ).not.toHaveAttribute("aria-current");
  });
});

describe("MobileMenu", () => {
  it("opens as a dialog and closes with Escape, returning focus", async () => {
    const user = userEvent.setup();
    render(<MobileMenu {...props} />);
    const trigger = screen.getByRole("button", { name: "Open menu" });
    await user.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "Menu" });
    expect(dialog).toHaveTextContent("Birth Control");
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
  });

  it("closes from the close button", async () => {
    const user = userEvent.setup();
    render(<MobileMenu {...props} defaultOpen />);
    await user.click(screen.getByRole("button", { name: "Close menu" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });
});
