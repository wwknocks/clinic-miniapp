"use client";

import { m } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";

export default function BillingPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-40 font-bold mb-8">Billing & Subscription</h1>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Management</CardTitle>
            <CardDescription>
              Manage your billing and subscription settings
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-center py-12">
              <p className="text-15 text-text-secondary">
                Billing and subscription management features will be available
                here.
              </p>
            </div>
          </CardContent>
        </Card>
      </m.div>
    </div>
  );
}
