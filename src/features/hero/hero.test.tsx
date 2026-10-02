import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { homeContent, languages, programs } from "@/content/mock";
import { Hero } from "./Hero";
import { toHeroProps } from "./to-hero-props";

describe("toHeroProps", () => {
  const props = toHeroProps(homeContent, programs, languages);

  it("builds category cards from the referenced programs", () => {
    expect(props.categories.map((c) => c.eyebrow)).toEqual([
      "Weight management",
      "Birth control",
      "Sleep",
    ]);
    expect(props.categories.every((c) => c.cta?.label === "See plans")).toBe(
      true,
    );
  });

  it("skips cards whose program is missing", () => {
    const result = toHeroProps(homeContent, programs.slice(0, 1), languages);
    expect(result.categories).toHaveLength(1);
  });

  it("passes the highlighted languages from content", () => {
    expect(props.highlightedLanguages).toEqual(["zh", "pt"]);
  });
});

describe("Hero", () => {
  it("renders the headline as the page h1 with the highlighted run", () => {
    render(<Hero {...toHeroProps(homeContent, programs, languages)} />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Healthcare that\s+speaks your language\./,
      }),
    ).toBeInTheDocument();
  });

  it("renders one labelled group of 11 language toggles", () => {
    render(<Hero {...toHeroProps(homeContent, programs, languages)} />);
    const group = screen.getByRole("group", {
      name: "Languages available for your consultation",
    });
    expect(group).toBeInTheDocument();
    // Clones are inert, so only one set is exposed.
    expect(screen.getByRole("button", { name: "العربية" })).toHaveAttribute(
      "dir",
      "rtl",
    );
  });

  it("hides sections that have no data", () => {
    render(
      <Hero
        {...toHeroProps(homeContent, programs, languages)}
        languages={[]}
        categories={[]}
      />,
    );
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "See plans" }),
    ).not.toBeInTheDocument();
  });
});
