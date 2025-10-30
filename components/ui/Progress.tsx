"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { m } from "framer-motion";
import { progressVariants } from "@/lib/motion";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  showLabel?: boolean;
  variant?: "default" | "accent" | "success" | "warning" | "danger";
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      showLabel = false,
      variant = "accent",
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const variantClasses = {
      default: "bg-text-secondary",
      accent: "bg-accent",
      success: "bg-success",
      warning: "bg-warning",
      danger: "bg-danger",
    };

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <div className="flex items-center justify-between mb-2">
          {showLabel && (
            <span className="text-13 text-text-secondary">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-glass border border-white/10">
          <m.div
            className={cn(
              "h-full rounded-full transition-colors duration-200",
              variantClasses[variant]
            )}
            initial="initial"
            animate="animate"
            custom={percentage}
            variants={progressVariants}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
