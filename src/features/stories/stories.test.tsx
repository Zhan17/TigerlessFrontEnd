import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { homeContent, programs, testimonials } from "@/content/mock";
import { SuccessStories } from "./SuccessStories";
import { toStoriesProps } from "./to-stories-props";

const props = toStoriesProps(homeContent, testimonials, programs);

describe("toStoriesProps", () => {
  it("names the category after the referenced program", () => {
    const [first] = props.stories;
    expect(first?.kind === "quote" && first.category).toBe("Weight Loss");
  });

  it("drops the category when the program is missing", () => {
    const [first] = toStoriesProps(homeContent, testimonials, []).stories;
    expect(first?.kind === "quote" && first.category).toBeNull();
  });

  it("labels social links with the author and platform", () => {
    expect(props.stories[0]?.author.socials[2]?.label).toBe(
      "Maria R. on LinkedIn",
    );
  });
});

describe("SuccessStories", () => {
  it("renders quotes with ratings and the photo card", () => {
    render(<SuccessStories {...props} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Our Success Stories" }),
    ).toBeInTheDocument();
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(3);
    expect(
      within(cards[0] as HTMLElement).getByRole("img", {
        name: "Rated 5 out of 5",
      }),
    ).toBeInTheDocument();
    expect(
      within(cards[1] as HTMLElement).getByText("David L."),
    ).toBeInTheDocument();
    expect(
      within(cards[2] as HTMLElement).getByRole("link", {
        name: "An N. on Instagram",
      }),
    ).toHaveAttribute("href", "https://www.instagram.com");
  });
});
