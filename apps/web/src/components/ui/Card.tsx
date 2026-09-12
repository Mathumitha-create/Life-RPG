import React from "react";
import { cn } from "../../lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "panel" | "surface" | "parchment" | "accent";
  interactive?: boolean;
}

export function Card({
  className,
  variant = "panel",
  interactive = false,
  children,
  ...props
}: CardProps): React.JSX.Element {
  const variantStyles = {
    panel: "bg-rpg-panel border-rpg-border text-rpg-parchment shadow-pixel",
    surface: "bg-rpg-surface border-rpg-border text-rpg-parchment shadow-pixel-sm",
    parchment: "bg-rpg-parchment border-amber-900/30 text-rpg-bg shadow-pixel",
    accent: "bg-rpg-panel border-rpg-amber text-rpg-parchment shadow-glow-amber",
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-all duration-150",
        variantStyles[variant],
        interactive &&
          "cursor-pointer hover:border-rpg-amber hover:shadow-glow-amber active:translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
