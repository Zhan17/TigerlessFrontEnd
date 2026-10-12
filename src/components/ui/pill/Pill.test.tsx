import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Pill } from "./Pill";

describe("Pill", () => {
  it("is a toggle button that reports its selected state", () => {
    const { rerender } = render(<Pill>English</Pill>);
    const pill = screen.getByRole("button", { name: "English" });
    expect(pill).toHaveAttribute("aria-pressed", "false");
    rerender(<Pill selected>English</Pill>);
    expect(pill).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onClick so the parent can select it", async () => {
    const onClick = vi.fn();
    render(<Pill onClick={onClick}>中文</Pill>);
    await userEvent.click(screen.getByRole("button", { name: "中文" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("passes lang and dir through for right-to-left scripts", () => {
    render(
      <Pill lang="ar" dir="rtl">
        العربية
      </Pill>,
    );
    const pill = screen.getByRole("button", { name: "العربية" });
    expect(pill).toHaveAttribute("lang", "ar");
    expect(pill).toHaveAttribute("dir", "rtl");
  });
});
