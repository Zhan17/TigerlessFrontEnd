import type { SVGProps } from "react";

const SvgRadioUnchecked = (props: SVGProps<SVGSVGElement>) => (
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
    <path
      fill="currentColor"
      d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75m0-20c-5.101 0-9.25 4.149-9.25 9.25s4.149 9.25 9.25 9.25 9.25-4.149 9.25-9.25S17.101 2.75 12 2.75m0 16A6.76 6.76 0 0 1 5.25 12 6.76 6.76 0 0 1 12 5.25 6.76 6.76 0 0 1 18.75 12 6.76 6.76 0 0 1 12 18.75m0-12A5.256 5.256 0 0 0 6.75 12 5.256 5.256 0 0 0 12 17.25 5.256 5.256 0 0 0 17.25 12 5.256 5.256 0 0 0 12 6.75"
    />
  </svg>
);
export default SvgRadioUnchecked;
