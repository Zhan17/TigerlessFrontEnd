import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ArrowRightCircleIcon, SocialXIcon } from "@/components/icons";
import { IconButton, IconLink } from "./IconButton";

describe("IconButton", () => {
  it("exposes the label as the accessible name", () => {
    render(<IconButton label="Next slide" icon={ArrowRightCircleIcon} />);
    expect(
      screen.getByRole("button", { name: "Next slide" }),
    ).toBeInTheDocument();
  });

  it("does not fire when disabled", async () => {
    const onClick = vi.fn();
    render(
      <IconButton
        label="Previous slide"
        icon={ArrowRightCircleIcon}
        disabled
        onClick={onClick}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Previous slide" }),
    );
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("IconLink", () => {
  it("opens external profiles in a new tab safely", () => {
    render(
      <IconLink label="Apsu on X" icon={SocialXIcon} href="https://x.com" />,
    );
    const link = screen.getByRole("link", { name: "Apsu on X" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("keeps internal links in the same tab", () => {
    render(<IconLink label="FAQs" icon={SocialXIcon} href="#faq" />);
    expect(screen.getByRole("link", { name: "FAQs" })).not.toHaveAttribute(
      "target",
    );
  });
});
