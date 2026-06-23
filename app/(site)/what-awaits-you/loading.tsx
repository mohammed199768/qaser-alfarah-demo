"use client";

import PremiumSvgLoader from "@/components/site/PremiumSvgLoader";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1c1a17]">
      <PremiumSvgLoader variant="page" />
    </div>
  );
}
