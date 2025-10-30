import { Card } from "@/components/ui";

export default function BillingPage() {
  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-bg via-bg to-panel">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-40 font-bold mb-8 text-text-primary">
          Billing & Subscription
        </h1>

        <Card className="p-8">
          <div className="text-center py-12">
            <h2 className="text-24 font-semibold mb-4 text-text-primary">
              Billing Management
            </h2>
            <p className="text-15 text-text-secondary">
              Billing and subscription management features will be available
              here.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
