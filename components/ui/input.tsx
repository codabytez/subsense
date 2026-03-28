import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, disabled, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/40",
          "focus:outline-none focus:border-primary/50 transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
