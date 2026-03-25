import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:opacity-90",
        secondary:
          "bg-transparent text-foreground border border-foreground/20 hover:bg-foreground/5",
        inverted: "bg-foreground text-neutral hover:opacity-90",
        outlined:
          "bg-transparent text-foreground border border-foreground/20 hover:bg-foreground/5",
        tertiary: "bg-tertiary text-white hover:opacity-90",
      },
      size: {
        sm: "h-8 px-4 text-xs",
        default: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10 rounded",
        pill: "h-10 px-5 text-sm rounded",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon?: ReactNode;
}

export function Button({
  className,
  variant,
  size,
  icon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
