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
