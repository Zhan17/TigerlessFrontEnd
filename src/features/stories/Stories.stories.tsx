import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { homeContent, programs, testimonials } from "@/content/mock";
import { StoryCard } from "./StoryCard";
import { SuccessStories } from "./SuccessStories";
import { toStoriesProps } from "./to-stories-props";

const props = toStoriesProps(homeContent, testimonials, programs);

const meta = {
  title: "Sections/Success stories",
  component: SuccessStories,
  args: props,
  parameters: { layout: "fullscreen" },
  globals: { viewport: { value: "board1440", isRotated: false } },
  decorators: [
    (Story) => (
      <div className="bg-page py-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SuccessStories>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};
export const Mobile: Story = {
  globals: { viewport: { value: "board375", isRotated: false } },
};

const single = (index: number, pseudo?: Record<string, string[]>): Story => ({
  render: () => {
    const story = props.stories[index];
    return (
      <div className="mx-auto grid w-[26.5rem] p-4">
        {story ? <StoryCard {...story} /> : null}
      </div>
    );
  },
  parameters: pseudo ? { pseudo } : undefined,
});

export const QuoteCard = single(0);
export const PhotoCard = single(1);
/** Social link states (same circular-control states as elsewhere). */
export const QuoteSocialHover = single(0, { hover: ["a"] });
export const QuoteSocialPressed = single(0, { active: ["a"] });
export const PhotoSocialHover = single(1, { hover: ["a"] });
