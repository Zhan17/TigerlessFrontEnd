import type { Preview } from "@storybook/nextjs-vite";
import { useEffect } from "react";
import { workSans } from "../src/app/fonts";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => {
      // Mirror the root layout: expose the Work Sans variable on <html>.
      useEffect(() => {
        document.documentElement.classList.add(
          workSans.variable,
          "antialiased",
        );
      }, []);
      return <Story />;
    },
  ],
};

export default preview;
