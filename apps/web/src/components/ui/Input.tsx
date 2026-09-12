import React, { forwardRef, useId } from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-rpg-parchment uppercase tracking-wider"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-rpg-parchment-muted pointer-events-none shrink-0" aria-hidden="true">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "w-full bg-rpg-panel border border-rpg-border text-rpg-parchment text-sm rounded-lg px-3.5 py-2.5 transition-colors placeholder:text-rpg-parchment-muted/50 focus:outline-none focus:ring-2 focus:ring-rpg-amber focus:border-rpg-amber",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-rpg-danger focus:ring-rpg-danger focus:border-rpg-danger",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 text-rpg-parchment-muted shrink-0">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p id={errorId} className="text-xs font-medium text-rpg-danger flex items-center gap-1" role="alert">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={helperId} className="text-xs text-rpg-parchment-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
