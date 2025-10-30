import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-xl border border-white/10 bg-glass backdrop-blur-md px-4 py-3 text-15 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-200 scrollbar-thin",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
