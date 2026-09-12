import React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "amber" | "green" | "violet" | "blue" | "danger" | "neutral";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "amber",
  size = "sm",
  children,
  ...props
}: BadgeProps): React.JSX.Element {
  const variantStyles = {
    amber: "bg-amber-950/60 text-rpg-amber border-amber-500/40",
    green: "bg-emerald-950/60 text-rpg-green border-emerald-500/40",
    violet: "bg-purple-950/60 text-rpg-violet border-purple-500/40",
    blue: "bg-blue-950/60 text-rpg-blue border-blue-500/40",
    danger: "bg-red-950/60 text-rpg-danger border-red-500/40",
    neutral: "bg-rpg-panel text-rpg-parchment-muted border-rpg-border",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 font-semibold",
    md: "text-xs px-2.5 py-1 font-bold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border tracking-wide uppercase select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
