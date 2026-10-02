import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button, ButtonLink } from "./Button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: { layout: "centered" },
  args: {
    children: "Start a free consultation",
    variant: "primary",
    size: "lg",
    withArrow: true,
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["primary", "secondary", "outline"],
    },
    size: { control: "inline-radio", options: ["lg", "md"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Secondary buttons sit on the tinted category cards in the design. */
const onTintedCard: Story["decorators"] = [
  (Story) => (
    <div data-theme="weight-loss" className="rounded-card bg-theme-surface p-8">
      <Story />
    </div>
  ),
];

// ---- Primary (hero CTA, product cards, nav "Get started") ----------------
export const Primary: Story = {};
export const PrimaryHover: Story = { parameters: { pseudo: { hover: true } } };
export const PrimaryFocus: Story = {
  parameters: { pseudo: { focusVisible: true } },
};
export const PrimaryPressed: Story = {
  parameters: { pseudo: { active: true } },
};

// ---- Secondary ("See plans", consult buttons on tinted cards) ------------
export const Secondary: Story = {
  args: { variant: "secondary", size: "md", children: "See plans" },
  decorators: onTintedCard,
};
export const SecondaryHover: Story = {
  ...Secondary,
  parameters: { pseudo: { hover: true } },
};
export const SecondaryFocus: Story = {
  ...Secondary,
  parameters: { pseudo: { focusVisible: true } },
};
export const SecondaryPressed: Story = {
  ...Secondary,
  parameters: { pseudo: { active: true } },
};

// ---- Outline (nav "Login") ----------------------------------------------
export const Outline: Story = {
  args: { variant: "outline", size: "md", withArrow: false, children: "Login" },
};
export const OutlineHover: Story = {
  ...Outline,
  parameters: { pseudo: { hover: true } },
};
export const OutlineFocus: Story = {
  ...Outline,
  parameters: { pseudo: { focusVisible: true } },
};
export const OutlinePressed: Story = {
  ...Outline,
  parameters: { pseudo: { active: true } },
};

// ---- Disabled (only used by "Calculate BMI" while input is invalid) -------
export const Disabled: Story = {
  args: {
    size: "lg",
    withArrow: false,
    fullWidth: true,
    disabled: true,
    children: "Calculate BMI",
  },
  decorators: [
    (Story) => (
      <div className="w-[32rem]">
        <Story />
      </div>
    ),
  ],
};
/** Hover has no effect on a disabled button. */
export const DisabledHover: Story = {
  ...Disabled,
  parameters: { pseudo: { hover: true } },
};

// ---- Layout options -----------------------------------------------------
/** Mobile cards: full width, label left, arrow at the edge. */
export const FullWidthWithArrow: Story = {
  args: {
    variant: "primary",
    size: "md",
    fullWidth: true,
    children: "Get started",
  },
  decorators: [
    (Story) => (
      <div className="w-[20rem]">
        <Story />
      </div>
    ),
  ],
};
/** Mobile menu: full width, centred label, no arrow. */
export const FullWidthCentered: Story = {
  args: {
    variant: "outline",
    size: "md",
    fullWidth: true,
    withArrow: false,
    children: "Login",
  },
  decorators: [
    (Story) => (
      <div className="w-[20rem]">
        <Story />
      </div>
    ),
  ],
};
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="lg" withArrow>
        Large (56)
      </Button>
      <Button size="md" withArrow>
        Medium (48)
      </Button>
      <Button size="md">No arrow</Button>
    </div>
  ),
};

/** Same styles on an anchor (CTAs that have a destination). */
export const AsLink: Story = {
  render: () => (
    <ButtonLink href="#faq" size="lg" withArrow>
      Start a free consultation
    </ButtonLink>
  ),
};
export const AsLinkHover: Story = {
  ...AsLink,
  parameters: { pseudo: { hover: true } },
};
