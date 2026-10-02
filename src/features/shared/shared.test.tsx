import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CtaButton } from "./CtaButton";
import { iconFor } from "./icon-map";
import { hrefFor } from "./link";
import { RichText } from "./RichText";

describe("hrefFor", () => {
  it("maps each link type", () => {
    expect(hrefFor({ type: "anchor", target: "faq" })).toBe("#faq");
    expect(hrefFor({ type: "route", path: "/login" })).toBe("/login");
    expect(hrefFor({ type: "external", url: "https://x.com" })).toBe(
      "https://x.com",
    );
    expect(hrefFor({ type: "none" })).toBeNull();
  });
});

describe("iconFor", () => {
  it("returns null for unknown keys instead of throwing", () => {
    expect(iconFor("truck")).not.toBeNull();
    expect(iconFor("rocket")).toBeNull();
  });
});

describe("CtaButton", () => {
  it("is a button when the CTA has no destination", () => {
    render(
      <CtaButton cta={{ label: "Get started", link: { type: "none" } }} />,
    );
    expect(
      screen.getByRole("button", { name: "Get started" }),
    ).toBeInTheDocument();
  });

  it("is a link when it has one", () => {
    render(
      <CtaButton
        cta={{ label: "FAQs", link: { type: "anchor", target: "faq" } }}
      />,
    );
    expect(screen.getByRole("link", { name: "FAQs" })).toHaveAttribute(
      "href",
      "#faq",
    );
  });
});

describe("RichText", () => {
  it("renders emphasised runs and keeps the full text", () => {
    const { container } = render(
      <h1>
        <RichText
          segments={[
            { text: "Healthcare that " },
            { text: "speaks your language.", emphasis: true },
          ]}
        />
      </h1>,
    );
    expect(container.textContent).toBe("Healthcare that speaks your language.");
    expect(screen.getByText("speaks your language.")).toHaveClass(
      "text-accent",
    );
  });
});
