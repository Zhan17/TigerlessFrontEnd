import type { Preview } from "@storybook/nextjs-vite";
import { useEffect } from "react";
import { workSans } from "../src/app/fonts";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    // The two design boards plus the in-between widths we care about.
    viewport: {
      options: {
        board375: {
          name: "Mobile board (375)",
          styles: { width: "375px", height: "812px" },
        },
        tablet768: {
          name: "Tablet (768)",
          styles: { width: "768px", height: "1024px" },
        },
        board1440: {
          name: "Desktop board (1440)",
          styles: { width: "1440px", height: "900px" },
        },
      },
    },
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
