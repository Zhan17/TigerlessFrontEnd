import type { SVGProps } from "react";

const SvgArrowRightCircleFilled = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 40 40"
    width="1em"
    height="1em"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path
      fill="currentColor"
      d="M20 36.667c9.205 0 16.667-7.462 16.667-16.667S29.205 3.333 20 3.333 3.333 10.795 3.333 20 10.795 36.667 20 36.667"
    />
    <path
      fill="var(--icon-contrast, #fff)"
      d="M27.82 19.522a1.25 1.25 0 0 0-.27-.407l-5-5a1.25 1.25 0 1 0-1.768 1.768l2.866 2.867H13.333a1.25 1.25 0 0 0 0 2.5h10.315l-2.866 2.867a1.25 1.25 0 0 0 1.766 1.768l5-5c.115-.115.207-.253.27-.406.128-.307.128-.65.002-.957"
    />
  </svg>
);
export default SvgArrowRightCircleFilled;
