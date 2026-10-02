import type { SVGProps } from "react";

const SvgCheckCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <circle cx={12} cy={12} r={10} fill="currentColor" />
    <path
      stroke="var(--icon-contrast, #fff)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m8 12.4 2.6 2.6L16 9.6"
    />
  </svg>
);
export default SvgCheckCircle;
