"use client";

import { m } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-40 font-bold mb-8">Privacy Policy</h1>

        <Card>
          <CardHeader>
            <CardTitle>Your Privacy Matters</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <section className="space-y-2">
              <h2 className="text-18 font-semibold">
                1. Information We Collect
              </h2>
              <p className="text-15 text-text-secondary leading-relaxed">
                We collect information that you provide directly to us,
                including when you create an account, use our services, or
                communicate with us. This may include your name, email address,
                and any other information you choose to provide.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-18 font-semibold">
                2. How We Use Your Information
              </h2>
              <p className="text-15 text-text-secondary leading-relaxed">
                We use the information we collect to provide, maintain, and
                improve our services, to communicate with you, and to comply
                with legal obligations. We do not sell your personal information
                to third parties.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-18 font-semibold">3. Data Security</h2>
              <p className="text-15 text-text-secondary leading-relaxed">
                We take reasonable measures to help protect your personal
                information from loss, theft, misuse, unauthorized access,
                disclosure, alteration, and destruction. However, no internet or
                email transmission is ever fully secure or error-free.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-18 font-semibold">4. Third-Party Services</h2>
              <p className="text-15 text-text-secondary leading-relaxed">
                Our application may contain links to third-party websites or
                services. We are not responsible for the privacy practices of
                these third parties. We encourage you to read their privacy
                policies before providing any information to them.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-18 font-semibold">5. Your Rights</h2>
              <p className="text-15 text-text-secondary leading-relaxed">
                You have the right to access, update, or delete your personal
                information at any time. You may also have the right to restrict
                or object to certain processing of your data. To exercise these
                rights, please contact us using the information provided below.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-18 font-semibold">
                6. Changes to This Policy
              </h2>
              <p className="text-15 text-text-secondary leading-relaxed">
                We may update this privacy policy from time to time. We will
                notify you of any changes by posting the new privacy policy on
                this page and updating the effective date.
              </p>
            </section>
          </CardContent>
        </Card>
      </m.div>
    </div>
  );
}
