import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { faqs, homeContent } from "@/content/mock";
import { FaqSection } from "./FaqSection";
import { toFaqProps } from "./to-faq-props";

const props = toFaqProps(homeContent, faqs);
const ids = props.items.map((item) => item.id);

const meta = {
  title: "Sections/FAQ",
  component: FaqSection,
  args: props,
  parameters: { layout: "fullscreen" },
  globals: { viewport: { value: "board1440", isRotated: false } },
  decorators: [
    (Story) => (
      <div className="bg-page">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FaqSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** As designed: the first question open. */
export const Default: Story = {};
export const Mobile: Story = {
  globals: { viewport: { value: "board375", isRotated: false } },
};
export const AllClosed: Story = { args: { defaultOpen: [] } };
/** Several answers open at once (multi-open accordion). */
export const SeveralOpen: Story = { args: { defaultOpen: ids } };

/** C7: an extreme answer length to check the open state copes. */
export const VeryLongAnswer: Story = {
  args: {
    defaultOpen: ["long"],
    items: [
      {
        id: "long",
        question:
          "A deliberately long question that wraps onto several lines on small screens to check the header layout?",
        answer: Array.from(
          { length: 6 },
          (_, index) =>
            `Paragraph ${index + 1}. Your physician reviews your history, explains each option in your language and adjusts the plan as you go; nothing ships until a licensed provider approves it, and your care team stays available for questions throughout treatment.`,
        ),
      },
      ...props.items.slice(1),
    ],
  },
};

/** Row states: closed hover, open hover, pressed, keyboard focus. */
export const ClosedHover: Story = {
  parameters: { pseudo: { hover: ['button[aria-expanded="false"]'] } },
};
export const OpenHover: Story = {
  parameters: { pseudo: { hover: ['button[aria-expanded="true"]'] } },
};
export const Pressed: Story = {
  parameters: { pseudo: { active: ['button[aria-expanded="false"]'] } },
};
export const Focus: Story = {
  parameters: { pseudo: { focusVisible: ['button[aria-expanded="false"]'] } },
};
