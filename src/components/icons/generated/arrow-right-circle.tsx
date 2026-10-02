import type { SVGProps } from "react";

const SvgArrowRightCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 48 48"
    width="1em"
    height="1em"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path
      fill="currentColor"
      d="M24 2.5C12.144 2.5 2.5 12.144 2.5 24S12.144 45.5 24 45.5 45.5 35.856 45.5 24 35.856 2.5 24 2.5m0 40C13.798 42.5 5.5 34.202 5.5 24S13.798 5.5 24 5.5 42.5 13.798 42.5 24 34.202 42.5 24 42.5m9.384-17.926c-.076.184-.186.35-.324.488l-6 6a1.497 1.497 0 0 1-2.12 0 1.5 1.5 0 0 1 0-2.122l3.44-3.44H16a1.5 1.5 0 0 1 0-3h12.378l-3.44-3.44a1.5 1.5 0 0 1 2.122-2.122l6 6a1.503 1.503 0 0 1 .324 1.636"
    />
  </svg>
);
export default SvgArrowRightCircle;
