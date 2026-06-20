import type { ReactNode } from "react";

export default function HomeCatalogScrollStage({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative mx-auto w-full max-w-6xl py-3 sm:py-6">
      <div className="catalog-stage-backdrop" aria-hidden="true" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
