import { Work_Sans } from "next/font/google";

// The design uses Work Sans only, at weights 400 and 500. Shared by the root
// layout and the Storybook preview so both render the same font.
export const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500"],
  display: "swap",
});
