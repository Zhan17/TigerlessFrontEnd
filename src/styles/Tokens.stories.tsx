import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { type ReactNode, useEffect, useState } from "react";

/**
 * Visual reference for the design tokens defined in src/app/globals.css.
 * Only token names are listed here; values are read from the live CSS
 * custom properties, so this page can never drift from the stylesheet.
 */

function useCssVar(name: string): string {
  const [value, setValue] = useState("");
  useEffect(() => {
    const read = () =>
      setValue(
        getComputedStyle(document.documentElement)
          .getPropertyValue(name)
          .trim(),
      );
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, [name]);
  return value;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-title font-medium text-heading">{title}</h2>
      {children}
    </section>
  );
}

function Swatch({ name }: { name: string }) {
  const value = useCssVar(`--color-${name}`);
  return (
    <div className="flex items-center gap-3">
      <span
        className="size-12 shrink-0 rounded-panel border border-border"
        style={{ background: `var(--color-${name})` }}
      />
      <span className="text-caption leading-snug">
        <code className="block text-heading">{name}</code>
        <code className="text-muted">{value}</code>
      </span>
    </div>
  );
}

const rawColors = [
  "brand-900",
  "brand-800",
  "green-600",
  "green-500",
  "mint-400",
  "mint-100",
  "green-light",
  "sage-500",
  "sage-400",
  "sage-300",
  "sage-200",
  "ink-900",
  "ink-850",
  "ink-800",
  "ink-780",
  "ink-700",
  "ink-600",
  "ink-550",
  "ink-500",
  "ink-450",
  "ink-400",
  "ink-300",
  "off-white",
  "input",
  "mist",
  "faq-tint",
  "border-mint",
  "border-blue",
  "border-pink",
  "border-footer",
  "card-mint",
  "card-purple",
  "card-blue",
  "star",
  "bmi-under",
  "bmi-healthy",
  "bmi-over",
  "bmi-obese",
];

const semanticColors = [
  "page",
  "surface",
  "surface-muted",
  "heading",
  "heading-strong",
  "copy",
  "muted",
  "accent",
  "accent-soft",
  "primary",
  "on-primary",
  "border",
  "selected",
  "inverse",
  "on-inverse",
  "focus",
];

function ColorGrid({ names }: { names: string[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-4">
      {names.map((name) => (
        <Swatch key={name} name={name} />
      ))}
    </div>
  );
}

const typeScale = [
  { token: "display", className: "text-display font-medium" },
  { token: "section", className: "text-section font-medium" },
  { token: "card-title", className: "text-card-title font-medium" },
  { token: "card-heading", className: "text-card-heading font-medium" },
  { token: "product-title", className: "text-product-title font-medium" },
  { token: "title", className: "text-title font-medium" },
  { token: "body", className: "text-body" },
  { token: "body-sm", className: "text-body-sm" },
  { token: "button", className: "text-button font-medium" },
  { token: "label", className: "text-label" },
  { token: "badge", className: "text-badge font-medium" },
  { token: "eyebrow", className: "text-eyebrow uppercase" },
  { token: "eyebrow-lg", className: "text-eyebrow-lg uppercase" },
  { token: "caption", className: "text-caption" },
];

function TypeRow({ token, className }: { token: string; className: string }) {
  const size = useCssVar(`--text-${token}`);
  return (
    <div className="grid gap-1 border-b border-border py-3 md:grid-cols-[14rem_1fr] md:gap-6">
      <code className="text-caption leading-snug text-muted">
        <span className="block text-heading">text-{token}</span>
        {size}
      </code>
      <p className={`${className} text-heading`}>
        Healthcare that speaks your language
      </p>
    </div>
  );
}

const meta = {
  title: "Foundations/Tokens",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  render: () => (
    <>
      <Section title="Semantic aliases (use these)">
        <ColorGrid names={semanticColors} />
      </Section>
      <Section title="Raw palette">
        <ColorGrid names={rawColors} />
      </Section>
    </>
  ),
};

export const Typography: Story = {
  render: () => (
    <Section title="Fluid type scale (resize the viewport: 375px and 1440px match the boards)">
      {typeScale.map((row) => (
        <TypeRow key={row.token} {...row} />
      ))}
    </Section>
  ),
};

export const RadiusAndShadow: Story = {
  render: () => (
    <>
      <Section title="Radius">
        <div className="flex flex-wrap gap-6">
          {["shell", "card", "panel", "full"].map((r) => (
            <div key={r} className="text-center">
              <div
                className="size-24 border border-border bg-surface"
                style={{
                  borderRadius: r === "full" ? "9999px" : `var(--radius-${r})`,
                }}
              />
              <code className="text-caption">rounded-{r}</code>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Shadows">
        <div className="flex flex-wrap gap-8">
          {["card", "soft", "pill", "raised", "layered"].map((s) => (
            <div key={s} className="text-center">
              <div
                className="size-28 rounded-card bg-surface"
                style={{ boxShadow: `var(--shadow-${s})` }}
              />
              <code className="mt-2 block text-caption">shadow-{s}</code>
            </div>
          ))}
        </div>
      </Section>
    </>
  ),
};

export const CategoryThemes: Story = {
  render: () => (
    <Section title="data-theme → bg-theme-surface / border-theme-divider">
      <div className="grid gap-4 md:grid-cols-4">
        {["weight-loss", "birth-control", "sleep", "unknown-category"].map(
          (theme) => (
            <div
              key={theme}
              data-theme={theme}
              className="rounded-card bg-theme-surface p-6"
            >
              <code className="text-caption text-heading">{theme}</code>
              <hr className="my-4 border-theme-divider" />
              <p className="text-body-sm">
                Falls back to defaults when unknown.
              </p>
            </div>
          ),
        )}
      </div>
    </Section>
  ),
};
