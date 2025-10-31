"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, CreditCard, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/actions/auth-actions";
import { useToast } from "./Toast";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

export interface UserDropdownProps {
  user: {
    email?: string | null;
    full_name?: string | null;
  };
}

export function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    setIsLoading(true);
    setIsOpen(false);

    try {
      const result = await signOut();

      if (!result.success) {
        addToast({
          title: "Sign out failed",
          description: result.error || "An unexpected error occurred",
          variant: "error",
        });
        setIsLoading(false);
        return;
      }

      addToast({
        title: "Signed out",
        description: "You've been successfully signed out",
        variant: "success",
      });

      router.push("/login");
      router.refresh();
    } catch (error) {
      addToast({
        title: "Sign out failed",
        description: "An unexpected error occurred",
        variant: "error",
      });
      setIsLoading(false);
    }
  };

  const displayName = user.full_name || user.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 px-4 py-2 rounded-xl bg-glass border border-white/10 backdrop-blur-md",
          "hover:bg-white/5 transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg"
        )}
        disabled={isLoading}
      >
        <div className="h-8 w-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
          <span className="text-13 font-semibold text-accent">{initials}</span>
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-13 font-medium text-text-primary">{displayName}</p>
          <p className="text-11 text-text-secondary">{user.email}</p>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-text-secondary transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="initial"
            variants={fadeInUp}
            className={cn(
              "absolute right-0 mt-2 w-56 rounded-xl bg-panel border border-white/10 backdrop-blur-md shadow-glass-lg overflow-hidden z-50"
            )}
          >
            <div className="p-3 border-b border-white/10">
              <p className="text-13 font-medium text-text-primary truncate">
                {displayName}
              </p>
              <p className="text-11 text-text-secondary truncate">
                {user.email}
              </p>
            </div>
            <div className="py-2">
              <Link
                href="/profile"
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 text-15 text-text-primary",
                  "hover:bg-white/5 transition-colors duration-200"
                )}
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4 text-text-secondary" />
                Profile
              </Link>
              <Link
                href="/billing"
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 text-15 text-text-primary",
                  "hover:bg-white/5 transition-colors duration-200"
                )}
                onClick={() => setIsOpen(false)}
              >
                <CreditCard className="h-4 w-4 text-text-secondary" />
                Billing
              </Link>
            </div>
            <div className="border-t border-white/10 py-2">
              <button
                onClick={handleSignOut}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 text-15 text-danger w-full",
                  "hover:bg-danger/5 transition-colors duration-200",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
                disabled={isLoading}
              >
                <LogOut className="h-4 w-4" />
                {isLoading ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
