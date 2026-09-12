import React from "react";
import { cn } from "../../lib/utils";

export interface ProgressBarProps {
  value: number; // Current value in range
  max: number; // Max value in range
  label?: string;
  subLabel?: string;
  variant?: "amber" | "green" | "violet" | "blue";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProgressBar({
  value,
  max,
  label,
  subLabel,
  variant = "amber",
  size = "md",
  className,
}: ProgressBarProps): React.JSX.Element {
  const safeMax = Math.max(1, max);
  const safeVal = Math.max(0, Math.min(value, safeMax));
  const percentage = Math.round((safeVal / safeMax) * 100);

  const fillColors = {
    amber: "bg-rpg-amber shadow-glow-amber",
    green: "bg-rpg-green shadow-glow-green",
    violet: "bg-rpg-violet shadow-glow-violet",
    blue: "bg-rpg-blue",
  };

  const heightStyles = {
    sm: "h-2",
    md: "h-3.5",
    lg: "h-5",
  };

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {(label || subLabel) && (
        <div className="flex justify-between items-center text-xs font-semibold">
          {label && <span className="text-rpg-parchment">{label}</span>}
          {subLabel && <span className="text-rpg-parchment-muted">{subLabel}</span>}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={safeVal}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-label={label || "Progress"}
        aria-valuetext={`${safeVal} of ${safeMax} (${percentage}%)`}
        className={cn(
          "w-full bg-rpg-bg rounded-full overflow-hidden border border-rpg-border p-0.5 relative",
          heightStyles[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            fillColors[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
