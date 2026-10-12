import type { SVGProps } from "react";

const SvgSort = (props: SVGProps<SVGSVGElement>) => (
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
      d="m6.29 8.314 4.016-4.761a1.564 1.564 0 0 1 2.387 0l4.015 4.761c.675.8.102 2.019-.948 2.019H7.239c-1.05 0-1.622-1.219-.948-2.019m9.47 5.353H7.24c-1.05 0-1.623 1.22-.948 2.02l4.015 4.76a1.564 1.564 0 0 0 2.387 0l4.015-4.76c.674-.802.102-2.02-.948-2.02"
    />
  </svg>
);
export default SvgSort;
