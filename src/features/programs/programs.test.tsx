import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { homeContent, products, programs } from "@/content/mock";
import { HowItWorks, toHowItWorksProps } from "@/features/how-it-works";
import { TrustStrip } from "@/features/trust-strip";
import { ProgramSection } from "./ProgramSection";
import { toProgramSectionsProps } from "./to-programs-props";

describe("toProgramSectionsProps", () => {
  const sections = toProgramSectionsProps(homeContent, programs, products);

  it("keeps the order from home content and attaches products", () => {
    expect(sections.map((s) => s.id)).toEqual([
      "weight-loss",
      "birth-control",
      "sleep",
    ]);
    expect(sections[0]?.products.map((p) => p.name)).toEqual([
      "Compounded Semaglutide",
      "Compounded Tirzepatide",
    ]);
    expect(sections[1]?.products).toEqual([]);
  });

  it("uses the program name as the eyebrow only when asked", () => {
    expect(sections[0]?.eyebrow).toBe("Weight Loss");
    expect(sections[1]?.eyebrow).toBeNull();
  });

  it("maps layout per category with a default", () => {
    expect(sections.find((s) => s.id === "sleep")?.imageSide).toBe("left");
    expect(sections[0]?.imageSide).toBe("right");
  });
});

describe("ProgramSection", () => {
  const [weightLoss] = toProgramSectionsProps(homeContent, programs, products);

  it("is an anchored, labelled section with its products", () => {
    if (!weightLoss) throw new Error("missing mock");
    const { container } = render(<ProgramSection {...weightLoss} />);
    const section = container.querySelector("section#weight-loss");
    expect(section).not.toBeNull();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Lose Weight In Your Way.",
      }),
    ).toBeInTheDocument();
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(2);
    expect(
      within(cards[0] as HTMLElement).getByText("$200"),
    ).toBeInTheDocument();
  });
});

describe("TrustStrip", () => {
  it("exposes one copy of the items to assistive tech", () => {
    render(<TrustStrip items={homeContent.trustStrip.items} />);
    const region = screen.getByRole("region", {
      name: "Why patients choose Apsu",
    });
    expect(within(region).getAllByRole("list")).toHaveLength(1);
    // Role queries skip the aria-hidden duplicate used for the seamless loop.
    const items = within(region).getAllByRole("listitem");
    expect(items).toHaveLength(5);
    expect(items[2]).toHaveTextContent("Cash-pay, No Insurance Needed");
  });

  it("renders nothing without items", () => {
    const { container } = render(<TrustStrip items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("HowItWorks", () => {
  it("numbers the steps in order", () => {
    render(<HowItWorks {...toHowItWorksProps(homeContent)} />);
    const steps = screen
      .getAllByRole("listitem")
      .filter((li) => li.querySelector("h3"));
    expect(steps.map((li) => li.querySelector("h3")?.textContent)).toEqual([
      "Human physicians",
      "AI care assistant",
    ]);
    expect(steps[0]).toHaveTextContent("01");
  });
});
