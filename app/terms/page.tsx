"use client";

import { m } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function TermsPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-40 font-bold mb-8">Terms of Service</h1>

        <Card>
          <CardHeader>
            <CardTitle>Terms and Conditions</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <section className="space-y-2">
              <h2 className="text-18 font-semibold">1. Acceptance of Terms</h2>
              <p className="text-15 text-text-secondary leading-relaxed">
                By accessing and using this application, you accept and agree to
                be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-18 font-semibold">2. Use License</h2>
              <p className="text-15 text-text-secondary leading-relaxed">
                Permission is granted to temporarily download one copy of the
                materials on the application for personal, non-commercial
                transitory viewing only.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-18 font-semibold">3. Disclaimer</h2>
              <p className="text-15 text-text-secondary leading-relaxed">
                The materials on the application are provided on an &apos;as
                is&apos; basis. We make no warranties, expressed or implied, and
                hereby disclaim and negate all other warranties including,
                without limitation, implied warranties or conditions of
                merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of
                rights.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-18 font-semibold">4. Limitations</h2>
              <p className="text-15 text-text-secondary leading-relaxed">
                In no event shall the company or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit, or due to business interruption) arising out of the
                use or inability to use the materials on the application.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-18 font-semibold">5. Revisions</h2>
              <p className="text-15 text-text-secondary leading-relaxed">
                The materials appearing on the application could include
                technical, typographical, or photographic errors. We do not
                warrant that any of the materials on the application are
                accurate, complete, or current.
              </p>
            </section>
          </CardContent>
        </Card>
      </m.div>
    </div>
  );
}
