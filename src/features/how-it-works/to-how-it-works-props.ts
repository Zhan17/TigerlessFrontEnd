import type { HomeContent } from "@/content/schemas";
import type { HowItWorksProps } from "./HowItWorks";

/** API content -> How it works props. */
export function toHowItWorksProps(home: HomeContent): HowItWorksProps {
  const { eyebrow, heading, subtitle, steps, footnote } = home.howItWorks;
  return { eyebrow, heading, subtitle, steps, footnote };
}
