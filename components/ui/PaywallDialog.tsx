"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./Dialog";
import { Button } from "./Button";
import { Badge } from "./Badge";

export interface PricingPlan {
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

interface PaywallDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  plans: PricingPlan[];
  onSelectPlan: (planName: string) => void;
}

const PaywallDialog = ({
  open,
  onOpenChange,
  title = "Upgrade to Premium",
  description = "Unlock all features and take your experience to the next level",
  plans,
  onSelectPlan,
}: PaywallDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-accent/10 border border-accent/20">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>

        <div className={cn(
          "grid gap-6 mt-6",
          plans.length === 1 ? "grid-cols-1" : "md:grid-cols-2"
        )}>
          {plans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                "relative rounded-2xl border p-6 transition-all duration-200",
                plan.highlighted
                  ? "bg-accent/5 border-accent/20 shadow-glow-accent"
                  : "bg-glass border-white/10"
              )}
            >
              {plan.badge && (
                <Badge
                  variant="accent"
                  className="absolute -top-3 left-1/2 -translate-x-1/2"
                >
                  {plan.badge}
                </Badge>
              )}

              <div className="mb-6">
                <h3 className="text-24 font-semibold text-text-primary mb-2">
                  {plan.name}
                </h3>
                <p className="text-13 text-text-secondary mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-40 font-bold text-text-primary">
                    {plan.price}
                  </span>
                  <span className="text-15 text-text-secondary">
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="rounded-full p-0.5 bg-accent/10 mt-0.5">
                      <Check className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-15 text-text-primary">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlighted ? "accent" : "solid"}
                className="w-full"
                onClick={() => onSelectPlan(plan.name)}
              >
                Choose {plan.name}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-11 text-text-tertiary text-center mt-6">
          You can cancel anytime. No questions asked.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export { PaywallDialog };
