import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins conditional class names", () => {
    expect(cn("a", false && "b", ["c", { d: true, e: false }])).toBe("a c d");
  });

  it("lets later Tailwind utilities win over conflicting earlier ones", () => {
    expect(cn("px-4 text-sm", "px-6")).toBe("text-sm px-6");
  });
});

describe("cn with design tokens", () => {
  it("keeps a custom font-size token next to a colour token", () => {
    expect(cn("text-button", "text-on-primary")).toBe(
      "text-button text-on-primary",
    );
  });

  it("still resolves conflicts between two custom font sizes", () => {
    expect(cn("text-body", "text-title")).toBe("text-title");
  });

  it("resolves conflicts between custom shadows and radii", () => {
    expect(cn("shadow-card rounded-card", "shadow-soft rounded-shell")).toBe(
      "shadow-soft rounded-shell",
    );
  });
});
