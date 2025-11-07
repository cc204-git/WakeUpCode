
import React from 'react';

export const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21A3.48 3.48 0 0 1 9 19c-1.66 0-3-1.34-3-3 0-1.42 1.04-2.28 2-2.45V12c-2.5-1-4-2.5-4-4 0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.5-1.5 3-4 4z"></path>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21A3.48 3.48 0 0 0 15 19c1.66 0 3-1.34 3-3 0-1.42-1.04-2.28-2-2.45V12c2.5-1 4-2.5 4-4 0-2.21-1.79-4-4-4s-4 1.79-4 4c0 1.5 1.5 3 4 4z"></path>
  </svg>
);
