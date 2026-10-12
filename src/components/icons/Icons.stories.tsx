import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ComponentType, CSSProperties, SVGProps } from "react";
import * as icons from "./generated";
import {
  ArrowRightCircleFilledIcon,
  ArrowRightCircleIcon,
  CheckCircleIcon,
  ChevronUpIcon,
} from "./generated";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const allIcons = Object.entries(icons as Record<string, IconComponent>);

type GalleryArgs = { size: number; color: string };

function Gallery({ size, color }: GalleryArgs) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
      {allIcons.map(([name, Icon]) => (
        <figure
          key={name}
          className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface p-4"
        >
          <Icon style={{ fontSize: size, color }} />
          <figcaption className="text-caption text-heading">{name}</figcaption>
        </figure>
      ))}
    </div>
  );
}

const meta = {
  title: "Foundations/Icons",
  component: Gallery,
  parameters: { layout: "padded" },
  args: { size: 32, color: "#102b1c" },
  argTypes: {
    size: { control: { type: "range", min: 12, max: 64, step: 4 } },
    color: { control: "color" },
  },
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every generated icon; colour follows `currentColor`, size follows font-size. */
export const AllIcons: Story = {};

const contrast = (value: string) =>
  ({ "--icon-contrast": value }) as CSSProperties;

/**
 * Two-tone icons: the outer shape uses `currentColor`, the inner glyph uses
 * `--icon-contrast`. One source covers both button styles from the design.
 */
export const TwoTone: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      <span className="inline-flex items-center gap-2 rounded-full bg-primary py-2 pr-2 pl-8 text-button font-medium text-on-primary">
        Primary
        <ArrowRightCircleFilledIcon
          className="size-10 text-white"
          style={contrast("var(--color-brand-900)")}
        />
      </span>
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface py-2 pr-2 pl-8 text-button font-medium text-heading-strong">
        Secondary
        <ArrowRightCircleFilledIcon
          className="size-8 text-ink-900"
          style={contrast("var(--color-white)")}
        />
      </span>
      <span className="inline-flex items-center gap-2 text-body text-copy">
        <CheckCircleIcon className="size-6 text-green-600" /> Check list item
      </span>
    </div>
  ),
};

/** Mirrored uses: the design rotates one source instead of shipping two. */
export const Directions: Story = {
  render: () => (
    <div className="flex items-center gap-6 text-heading">
      <ArrowRightCircleIcon className="size-12 rotate-180" />
      <ArrowRightCircleIcon className="size-12" />
      <ChevronUpIcon className="size-6" />
      <ChevronUpIcon className="size-6 -scale-y-100" />
    </div>
  ),
};
