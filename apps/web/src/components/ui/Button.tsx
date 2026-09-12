import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      leftIcon,
      rightIcon,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-semibold transition-all duration-150 rounded-lg select-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rpg-amber focus-visible:ring-offset-2 focus-visible:ring-offset-rpg-bg active:translate-y-0.5";

    const variantStyles = {
      primary:
        "bg-rpg-amber text-rpg-bg hover:bg-rpg-amber-hover shadow-pixel active:shadow-none border border-amber-300 font-bold",
      secondary:
        "bg-rpg-surface text-rpg-parchment hover:bg-rpg-surface-light border border-rpg-border shadow-pixel-sm active:shadow-none",
      outline:
        "bg-transparent text-rpg-parchment hover:bg-rpg-panel border border-rpg-border",
      ghost:
        "bg-transparent text-rpg-parchment-muted hover:text-rpg-parchment hover:bg-rpg-panel",
      danger:
        "bg-rpg-danger text-white hover:bg-red-600 border border-red-400 shadow-pixel-sm active:shadow-none",
      success:
        "bg-rpg-green text-rpg-bg hover:bg-emerald-400 border border-emerald-300 font-bold shadow-pixel-sm",
    };

    const sizeStyles = {
      sm: "text-xs px-2.5 py-1.5 gap-1.5 h-8",
      md: "text-sm px-4 py-2 gap-2 h-10",
      lg: "text-base px-6 py-2.5 gap-2.5 h-12",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        aria-disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
