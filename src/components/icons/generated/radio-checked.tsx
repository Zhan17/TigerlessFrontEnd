import type { SVGProps } from "react";

const SvgRadioChecked = (props: SVGProps<SVGSVGElement>) => (
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
      d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75m0-20c-5.101 0-9.25 4.149-9.25 9.25s4.149 9.25 9.25 9.25 9.25-4.149 9.25-9.25S17.101 2.75 12 2.75M18 12a6 6 0 1 0-12 0 6 6 0 0 0 12 0"
    />
  </svg>
);
export default SvgRadioChecked;
