"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { m } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { fadeInUp } from "@/lib/motion";
import { Button } from "./Button";

interface CTABannerProps {
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  variant?: "default" | "accent" | "success" | "gradient";
  className?: string;
}

const CTABanner = ({
  title,
  description,
  primaryAction,
  secondaryAction,
  onClose,
  variant = "default",
  className,
}: CTABannerProps) => {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 200);
  };

  const variantClasses = {
    default: "bg-panel/80",
    accent: "bg-accent/10 border-accent/20",
    success: "bg-success/10 border-success/20",
    gradient: "animated-gradient",
  };

  if (!isVisible) return null;

  return (
    <m.div
      className={cn(
        "relative rounded-2xl border border-white/10 backdrop-blur-md shadow-glass p-6",
        variantClasses[variant],
        className
      )}
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      {onClose && (
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pr-8">
        <div className="flex-1">
          <h3 className="text-18 font-semibold text-text-primary mb-1">{title}</h3>
          {description && (
            <p className="text-15 text-text-secondary">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {secondaryAction && (
            <Button
              variant="ghost"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
          {primaryAction && (
            <Button
              variant="accent"
              onClick={primaryAction.onClick}
              className="group"
            >
              {primaryAction.label}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
        </div>
      </div>
    </m.div>
  );
};

export { CTABanner };
