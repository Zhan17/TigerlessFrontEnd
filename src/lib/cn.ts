import { type CxOptions, cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

/**
 * Join conditional class names and resolve Tailwind conflicts
 * (later utilities win, e.g. `cn("px-4", "px-6")` -> "px-6").
 */
export function cn(...inputs: CxOptions): string {
  return twMerge(cx(inputs));
}
