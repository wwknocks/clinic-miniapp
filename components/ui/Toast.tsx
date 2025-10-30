"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { m, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { slideInFromTop } from "@/lib/motion";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export const useToast = () => React.useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = React.useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(7);
      const newToast = { ...toast, id };
      setToasts((prev) => [...prev, newToast]);

      const duration = toast.duration ?? 5000;
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
}

function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-0 right-0 z-[100] flex flex-col gap-2 p-4 max-w-md w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const icons = {
    default: Info,
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const Icon = icons[toast.variant || "default"];

  const variantClasses = {
    default: "border-white/10",
    success: "border-success/20 bg-success/5",
    error: "border-danger/20 bg-danger/5",
    warning: "border-warning/20 bg-warning/5",
    info: "border-accent/20 bg-accent/5",
  };

  const iconClasses = {
    default: "text-text-secondary",
    success: "text-success",
    error: "text-danger",
    warning: "text-warning",
    info: "text-accent",
  };

  return (
    <m.div
      className={cn(
        "pointer-events-auto w-full rounded-xl border bg-panel/95 backdrop-blur-md p-4 shadow-glass-lg",
        variantClasses[toast.variant || "default"]
      )}
      variants={slideInFromTop}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <div className="flex items-start gap-3">
        <Icon
          className={cn(
            "h-5 w-5 mt-0.5 flex-shrink-0",
            iconClasses[toast.variant || "default"]
          )}
        />
        <div className="flex-1 space-y-1">
          {toast.title && (
            <div className="text-15 font-medium text-text-primary">
              {toast.title}
            </div>
          )}
          {toast.description && (
            <div className="text-13 text-text-secondary">
              {toast.description}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors flex-shrink-0"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </m.div>
  );
}

export { Toaster };
