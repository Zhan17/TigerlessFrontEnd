import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { homeContent, services } from "@/content/mock";
import { ServiceCard } from "./ServiceCard";
import { ServicesCarousel } from "./ServicesCarousel";
import { toOnlineCareProps } from "./to-online-care-props";

const props = toOnlineCareProps(homeContent, services);

const meta = {
  title: "Sections/Services carousel",
  component: ServicesCarousel,
  args: props,
  parameters: { layout: "fullscreen" },
  globals: { viewport: { value: "board1440", isRotated: false } },
} satisfies Meta<typeof ServicesCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** At the start: "previous" is disabled; drag/swipe or use the arrows. */
export const Start: Story = {};

/** Scrolled to the last card: "next" is disabled. */
export const End: Story = { args: { defaultIndex: 3 } };

/** Middle: both arrows enabled. */
export const Middle: Story = { args: { defaultIndex: 1 } };

export const Mobile: Story = {
  globals: { viewport: { value: "board375", isRotated: false } },
};

/** Arrow states (same bubble states as every circular control). */
export const ArrowHover: Story = {
  args: { defaultIndex: 1 },
  parameters: { pseudo: { hover: ['button[aria-label="Next"]'] } },
};
export const ArrowPressed: Story = {
  args: { defaultIndex: 1 },
  parameters: { pseudo: { active: ['button[aria-label="Next"]'] } },
};
export const ArrowFocus: Story = {
  args: { defaultIndex: 1 },
  parameters: { pseudo: { focusVisible: ['button[aria-label="Next"]'] } },
};

const cardStory = (index: number): Story => ({
  render: () => {
    const service = props.services[index];
    return (
      <div className="flex justify-center bg-page p-10">
        {service ? <ServiceCard {...service} /> : null}
      </div>
    );
  },
});

/** Card layouts by media kind. */
export const CardChat = cardStory(0);
export const CardPhoto = cardStory(1);
export const CardProduct = cardStory(2);
