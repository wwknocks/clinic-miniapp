"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { m, AnimatePresence } from "framer-motion";
import { fadeIn } from "@/lib/motion";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

const Tooltip = ({
  content,
  children,
  side = "top",
  className,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const sideClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <m.div
            className={cn(
              "absolute z-50 px-3 py-1.5 text-13 text-text-primary bg-panel border border-white/10 rounded-lg shadow-glass backdrop-blur-md whitespace-nowrap pointer-events-none",
              sideClasses[side],
              className
            )}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {content}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { Tooltip };
