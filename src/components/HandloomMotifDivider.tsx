'use client';

import React from 'react';

export const HandloomMotifDivider: React.FC<{ className?: string }> = ({ className = 'my-4' }) => {
  return (
    <div className={`w-full overflow-hidden flex items-center justify-center opacity-85 select-none ${className}`}>
      <svg
        className="w-full max-w-4xl h-5 text-[#8B263E]"
        viewBox="0 0 1200 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 12 C 15 2, 30 2, 45 12 C 60 22, 75 22, 90 12 C 105 2, 120 2, 135 12 C 150 22, 165 22, 180 12 C 195 2, 210 2, 225 12 C 240 22, 255 22, 270 12 C 285 2, 300 2, 315 12 C 330 22, 345 22, 360 12 C 375 2, 390 2, 405 12 C 420 22, 435 22, 450 12 C 465 2, 480 2, 495 12 C 510 22, 525 22, 540 12 C 555 2, 570 2, 585 12 C 600 22, 615 22, 630 12 C 645 2, 660 2, 675 12 C 690 22, 705 22, 720 12 C 735 2, 750 2, 765 12 C 780 22, 795 22, 810 12 C 825 2, 840 2, 855 12 C 870 22, 885 22, 900 12 C 915 2, 930 2, 945 12 C 960 22, 975 22, 990 12 C 1005 2, 1020 2, 1035 12 C 1050 22, 1065 22, 1080 12 C 1095 2, 1110 2, 1125 12 C 1140 22, 1155 22, 1170 12 C 1185 2, 1200 2, 1215 12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Motif Loop Circles */}
        {[30, 90, 150, 210, 270, 330, 390, 450, 510, 570, 630, 690, 750, 810, 870, 930, 990, 1050, 1110, 1170].map(
          (cx, i) => (
            <circle key={i} cx={cx} cy="12" r="3.5" fill="currentColor" />
          )
        )}
      </svg>
    </div>
  );
};
