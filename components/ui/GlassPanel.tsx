import * as React from "react"
import { cn } from "@/lib/utils"

const GlassPanel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-glass
      className={cn(
        "rounded-[var(--brand-radius)] border border-[rgba(var(--glass-tint),var(--glass-border-opacity))] bg-[rgba(var(--glass-tint),var(--glass-tint-opacity))] backdrop-blur-[var(--glass-blur)] backdrop-saturate-[1.15]",
        className
      )}
      {...props}
    />
  )
)
GlassPanel.displayName = "GlassPanel"

export { GlassPanel }
