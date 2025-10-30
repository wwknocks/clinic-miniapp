"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { m, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { overlayVariants, scaleIn } from "@/lib/motion";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const DialogContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  open: false,
  onOpenChange: () => {},
});

const Dialog = ({
  open: controlledOpen,
  onOpenChange,
  children,
}: DialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <DialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, ...props }, ref) => {
  const { onOpenChange } = React.useContext(DialogContext);

  return (
    <button
      ref={ref}
      onClick={(e) => {
        onOpenChange(true);
        onClick?.(e);
      }}
      {...props}
    />
  );
});
DialogTrigger.displayName = "DialogTrigger";

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  showClose?: boolean;
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, showClose = true }, ref) => {
    const { open, onOpenChange } = React.useContext(DialogContext);
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && open) {
          onOpenChange(false);
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [open, onOpenChange]);

    return (
      <AnimatePresence>
        {open && (
          <>
            <m.div
              className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-sm"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => onOpenChange(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <m.div
                ref={ref || contentRef}
                className={cn(
                  "relative w-full max-w-lg bg-panel border border-white/10 rounded-2xl shadow-glass-lg backdrop-blur-md p-6",
                  className
                )}
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {showClose && (
                  <button
                    className="absolute right-4 top-4 rounded-lg p-1 text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                    onClick={() => onOpenChange(false)}
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {children}
              </m.div>
            </div>
          </>
        )}
      </AnimatePresence>
    );
  }
);
DialogContent.displayName = "DialogContent";

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left mb-4",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-24 font-semibold text-text-primary", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-15 text-text-secondary", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
