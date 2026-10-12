import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SocialLinks } from "./SocialLinks";

describe("SocialLinks", () => {
  it("renders one labelled external link per platform", () => {
    render(
      <SocialLinks
        links={[
          { platform: "x", href: "https://x.com", label: "Apsu on X" },
          {
            platform: "linkedin",
            href: "https://www.linkedin.com",
            label: "Apsu on LinkedIn",
          },
        ]}
      />,
    );
    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("link")).toHaveLength(2);
    expect(
      screen.getByRole("link", { name: "Apsu on LinkedIn" }),
    ).toHaveAttribute("href", "https://www.linkedin.com");
  });
});
