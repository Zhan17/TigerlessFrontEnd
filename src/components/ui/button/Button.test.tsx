import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button, ButtonLink } from "./Button";

describe("Button", () => {
  it("renders a non-submitting button by default", () => {
    render(<Button>Get started</Button>);
    expect(screen.getByRole("button", { name: "Get started" })).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("calls onClick when pressed", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Login</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Calculate BMI
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Calculate BMI" });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("adds a decorative arrow that does not change the accessible name", () => {
    const { container } = render(<Button withArrow>See plans</Button>);
    expect(
      screen.getByRole("button", { name: "See plans" }),
    ).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});

describe("ButtonLink", () => {
  it("renders a link with the button look", () => {
    render(<ButtonLink href="#faq">FAQs</ButtonLink>);
    const link = screen.getByRole("link", { name: "FAQs" });
    expect(link).toHaveAttribute("href", "#faq");
    expect(link).not.toHaveAttribute("target");
  });

  it("opens external URLs in a new tab safely", () => {
    render(<ButtonLink href="https://example.com">Docs</ButtonLink>);
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });
});
