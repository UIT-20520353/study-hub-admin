import React, { type SVGProps } from "react";

export const StudyHubLogo: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg width="120" height="120" viewBox="0 0 120 120" {...props}>
    <rect x="0" y="0" width="120" height="120" rx="30" ry="30" fill="#2563eb" />

    <rect
      x="30"
      y="75"
      width="60"
      height="15"
      rx="3"
      ry="3"
      fill="#34d399"
      transform="rotate(-5 30 75)"
    />

    <rect
      x="35"
      y="60"
      width="55"
      height="15"
      rx="3"
      ry="3"
      fill="#f97316"
      transform="rotate(3 35 60)"
    />

    <rect
      x="40"
      y="45"
      width="50"
      height="15"
      rx="3"
      ry="3"
      fill="#e4f1fe"
      transform="rotate(-3 40 45)"
    />
  </svg>
);
