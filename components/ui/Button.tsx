import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        solid:
          "bg-glass border border-white/10 text-text-primary hover:bg-white/10 hover:-translate-y-0.5 shadow-glass backdrop-blur-md",
        accent:
          "bg-accent text-bg hover:bg-accent/90 hover:-translate-y-0.5 shadow-glass",
        danger:
          "bg-danger text-white hover:bg-danger/90 hover:-translate-y-0.5 shadow-glass",
        ghost:
          "hover:bg-white/5 text-text-primary",
      },
      size: {
        sm: "h-9 px-3 text-13",
        md: "h-11 px-5 text-15",
        lg: "h-14 px-7 text-18",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
