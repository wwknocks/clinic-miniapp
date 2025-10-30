"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { m } from "framer-motion";

export interface MeterBarProps {
  label?: string;
  value: number;
  max?: number;
  showValue?: boolean;
  variant?: "default" | "accent" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const MeterBar = ({
  label,
  value,
  max = 100,
  showValue = true,
  variant = "accent",
  size = "md",
  className,
}: MeterBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variantClasses = {
    default: "bg-text-secondary",
    accent: "bg-accent",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
  };

  const variantGlowClasses = {
    default: "",
    accent: "shadow-glow-accent",
    success: "shadow-glow-success",
    warning: "",
    danger: "shadow-glow-danger",
  };

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-13 text-text-primary font-medium">{label}</span>}
          {showValue && (
            <span className="text-13 text-text-secondary">
              {value} / {max}
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-glass border border-white/10",
          sizeClasses[size]
        )}
      >
        <m.div
          className={cn(
            "h-full rounded-full transition-colors duration-200",
            variantClasses[variant],
            percentage > 70 && variantGlowClasses[variant]
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
        />
      </div>
    </div>
  );
};

export { MeterBar };
