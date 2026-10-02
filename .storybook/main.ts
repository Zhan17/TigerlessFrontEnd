import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "storybook-addon-pseudo-states"],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"],
};

export default config;
