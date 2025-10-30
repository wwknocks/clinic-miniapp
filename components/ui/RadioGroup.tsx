"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
  name?: string;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, children, name, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="radiogroup"
        className={cn("grid gap-2", className)}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              ...child.props,
              name,
              checked: child.props.value === value,
              onCheckedChange: (checked: boolean) => {
                if (checked) {
                  onValueChange?.(child.props.value);
                }
              },
            } as any);
          }
          return child;
        })}
      </div>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export interface RadioGroupItemProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  value: string;
  label: string;
  description?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  RadioGroupItemProps
>(({ className, value, label, description, checked, onCheckedChange, ...props }, ref) => {
  return (
    <label
      className={cn(
        "flex items-start space-x-3 rounded-xl border border-white/10 bg-glass backdrop-blur-md p-4 cursor-pointer transition-all duration-200",
        "hover:border-white/20 hover:bg-white/5",
        checked && "border-accent bg-accent/10",
        className
      )}
    >
      <input
        ref={ref}
        type="radio"
        value={value}
        checked={checked}
        onChange={(e) => {
          onCheckedChange?.(e.target.checked);
          props.onChange?.(e);
        }}
        className="mt-0.5 h-4 w-4 rounded-full border border-white/30 bg-transparent text-accent focus:ring-2 focus:ring-accent focus:ring-offset-0"
        {...props}
      />
      <div className="flex-1">
        <div className="text-15 font-medium text-text-primary">{label}</div>
        {description && (
          <div className="text-13 text-text-secondary mt-1">{description}</div>
        )}
      </div>
    </label>
  );
});
RadioGroupItem.displayName = "RadioGroupItem";
