import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            className={cn(
              "peer h-5 w-5 appearance-none rounded-lg border border-white/10 bg-glass backdrop-blur-md transition-all duration-200",
              "hover:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg",
              "checked:bg-accent checked:border-accent",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />
          <Check
            className="absolute h-4 w-4 text-bg pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
            strokeWidth={3}
          />
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-15 text-text-primary cursor-pointer select-none flex-1"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
