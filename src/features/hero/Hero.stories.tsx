import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { homeContent, languages, programs } from "@/content/mock";
import { CategoryCard } from "./CategoryCard";
import { Hero } from "./Hero";
import { LanguageMarquee } from "./LanguageMarquee";
import { TrustBadges } from "./TrustBadges";
import { toHeroProps } from "./to-hero-props";

const props = toHeroProps(homeContent, programs, languages);

const meta = {
  title: "Sections/Hero",
  component: Hero,
  args: props,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      // The shell normally tucks under the sticky nav; give it room here.
      <div className="pt-24 pb-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  globals: { viewport: { value: "board1440", isRotated: false } },
};
export const Mobile: Story = {
  globals: { viewport: { value: "board375", isRotated: false } },
};

// ---- Language marquee ---------------------------------------------------
/**
 * Drifts on its own; hover the middle to pause, an edge to speed up, drag on
 * touch. Click pills to toggle the highlight (multi-select).
 */
export const Languages: Story = {
  render: () => (
    <div className="bg-surface py-10">
      <LanguageMarquee
        languages={props.languages}
        highlighted={props.highlightedLanguages}
        label="Languages"
      />
    </div>
  ),
};
/** Nothing highlighted yet. */
export const LanguagesNoneSelected: Story = {
  render: () => (
    <div className="bg-surface py-10">
      <LanguageMarquee
        languages={props.languages}
        highlighted={[]}
        label="Languages"
      />
    </div>
  ),
};

export const Badges: Story = {
  render: () => (
    <div className="bg-surface p-10">
      <TrustBadges items={props.badges} />
    </div>
  ),
};

// ---- Category card states -------------------------------------------------
const card = props.categories[0];
const CardStory: Story = {
  render: () => (
    <div className="w-[26.5rem] p-10">
      {card ? <CategoryCard {...card} /> : null}
    </div>
  ),
  parameters: { layout: "centered" },
};

export const CardDefault: Story = { ...CardStory };
/** Hovering anywhere on the card: lift, softer shadow, image grows. */
export const CardHover: Story = {
  ...CardStory,
  parameters: { ...CardStory.parameters, pseudo: { hover: true } },
};
export const CardFocus: Story = {
  ...CardStory,
  parameters: { ...CardStory.parameters, pseudo: { focusVisible: true } },
};
export const CardPressed: Story = {
  ...CardStory,
  parameters: { ...CardStory.parameters, pseudo: { active: true } },
};
/** Unknown category from the API: default (white) theme. */
export const CardUnknownCategory: Story = {
  render: () => (
    <div className="w-[26.5rem] p-10">
      {card ? <CategoryCard {...card} category="dermatology" /> : null}
    </div>
  ),
  parameters: { layout: "centered" },
};
