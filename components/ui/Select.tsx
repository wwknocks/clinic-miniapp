"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, options, onValueChange, placeholder, onChange, ...props },
    ref
  ) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-11 w-full appearance-none rounded-xl border border-white/10 bg-glass backdrop-blur-md px-4 py-2 text-15 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
            className
          )}
          ref={ref}
          onChange={(e) => {
            onValueChange?.(e.target.value);
            onChange?.(e);
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
