import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { faqs, homeContent } from "@/content/mock";
import { FaqSection } from "./FaqSection";
import { toFaqProps } from "./to-faq-props";

const props = toFaqProps(homeContent, faqs);

describe("toFaqProps", () => {
  it("keeps the home order and the intro copy", () => {
    expect(props.items.map((item) => item.id)).toEqual(homeContent.faq.faqIds);
    expect(props.eyebrow).toBe("FAQs");
  });
});

describe("FaqSection", () => {
  it("opens the first question and lets several stay open", async () => {
    const user = userEvent.setup();
    render(<FaqSection {...props} />);
    const [first, second] = screen.getAllByRole("button");
    if (!first || !second) throw new Error("missing questions");

    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByText(
        "We are currently able to serve GLP-1 programs in all 50 states.",
      ),
    ).toBeVisible();
    expect(second).toHaveAttribute("aria-expanded", "false");

    await user.click(second);
    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(first).toHaveAttribute("aria-expanded", "true");

    await user.click(first);
    expect(first).toHaveAttribute("aria-expanded", "false");
  });

  it("renders multi-paragraph answers as paragraphs", () => {
    render(<FaqSection {...props} defaultOpen={["compounded-medication"]} />);
    const region = screen.getByRole("region", {
      name: "What is compounded medication?",
    });
    expect(region.querySelectorAll("p")).toHaveLength(3);
  });

  it("is the #faq anchor target", () => {
    const { container } = render(<FaqSection {...props} />);
    expect(container.querySelector("section#faq")).not.toBeNull();
  });
});
