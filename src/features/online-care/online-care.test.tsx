import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { homeContent, services } from "@/content/mock";
import { ServiceCard } from "./ServiceCard";
import { ServicesCarousel } from "./ServicesCarousel";
import { toOnlineCareProps } from "./to-online-care-props";

const props = toOnlineCareProps(homeContent, services);

describe("toOnlineCareProps", () => {
  it("keeps the home order and skips unknown ids", () => {
    expect(props.services.map((s) => s.id)).toEqual(
      homeContent.onlineCare.serviceIds,
    );
    const partial = toOnlineCareProps(
      {
        ...homeContent,
        onlineCare: {
          ...homeContent.onlineCare,
          serviceIds: ["missing", "expedited-shipping"],
        },
      },
      services,
    );
    expect(partial.services.map((s) => s.id)).toEqual(["expedited-shipping"]);
  });
});

describe("ServiceCard", () => {
  const byKind = (kind: string) => {
    const service = services.find((s) => s.media.kind === kind);
    if (!service) throw new Error(`no ${kind} service in mocks`);
    return service;
  };

  it("draws the chat preview from data as real text", () => {
    render(<ServiceCard {...byKind("chat")} />);
    expect(
      screen.getByRole("heading", { level: 3, name: "24/7 Provider Support" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Hello! How are you feeling today?"),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Dr. Helena Fox")).toHaveLength(2);
  });

  it("puts the photo behind the title", () => {
    const service = byKind("photo");
    render(<ServiceCard {...service} />);
    expect(screen.getByRole("img", { name: service.media.image.alt })).toBe(
      screen.getAllByRole("img")[0],
    );
  });
});

describe("ServicesCarousel", () => {
  it("labels the carousel, its slides and the arrow controls", () => {
    render(<ServicesCarousel {...props} />);
    const region = screen.getByRole("region", {
      name: "Completely online on your schedule",
    });
    expect(region).toHaveAttribute("aria-roledescription", "carousel");

    const slides = within(region).getAllByRole("group");
    expect(slides).toHaveLength(4);
    expect(slides[0]).toHaveAccessibleName("1 of 4");
    expect(slides[0]).toHaveAttribute("aria-roledescription", "slide");

    const track = slides[0]?.parentElement;
    for (const name of ["Previous", "Next"]) {
      expect(screen.getByRole("button", { name })).toHaveAttribute(
        "aria-controls",
        track?.id,
      );
    }
    // At the start the "previous" arrow is disabled.
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
  });
});
