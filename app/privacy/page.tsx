import { Card } from "@/components/ui";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-bg via-bg to-panel">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-15 text-text-secondary hover:text-text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <Card className="p-8 md:p-12">
          <h1 className="text-40 font-bold mb-4 text-text-primary">
            Privacy Policy
          </h1>
          <p className="text-15 text-text-secondary mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8 text-text-primary">
            <section>
              <h2 className="text-24 font-semibold mb-4">1. Introduction</h2>
              <p className="text-15 leading-relaxed text-text-secondary">
                We respect your privacy and are committed to protecting your
                personal data. This privacy policy will inform you about how we
                look after your personal data when you visit our website and
                tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-24 font-semibold mb-4">
                2. Information We Collect
              </h2>
              <p className="text-15 leading-relaxed text-text-secondary mb-4">
                We may collect, use, store and transfer different kinds of
                personal data about you which we have grouped together as
                follows:
              </p>
              <ul className="list-disc list-inside space-y-2 text-15 text-text-secondary ml-4">
                <li>
                  <strong>Identity Data:</strong> includes first name, last
                  name, username or similar identifier
                </li>
                <li>
                  <strong>Contact Data:</strong> includes email address and
                  telephone numbers
                </li>
                <li>
                  <strong>Technical Data:</strong> includes internet protocol
                  (IP) address, browser type and version, time zone setting and
                  location, browser plug-in types and versions, operating system
                  and platform
                </li>
                <li>
                  <strong>Usage Data:</strong> includes information about how
                  you use our website, products and services
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-24 font-semibold mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-15 leading-relaxed text-text-secondary mb-4">
                We will only use your personal data when the law allows us to.
                Most commonly, we will use your personal data in the following
                circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-15 text-text-secondary ml-4">
                <li>To register you as a new customer</li>
                <li>To process and deliver your orders</li>
                <li>To manage our relationship with you</li>
                <li>
                  To enable you to participate in features when you choose to do
                  so
                </li>
                <li>
                  To improve our website, products/services and customer service
                </li>
                <li>
                  To administer and protect our business and website (including
                  troubleshooting, data analysis, testing, system maintenance,
                  support, reporting and hosting of data)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-24 font-semibold mb-4">4. Data Security</h2>
              <p className="text-15 leading-relaxed text-text-secondary">
                We have put in place appropriate security measures to prevent
                your personal data from being accidentally lost, used or
                accessed in an unauthorized way, altered or disclosed. In
                addition, we limit access to your personal data to those
                employees, agents, contractors and other third parties who have
                a business need to know.
              </p>
            </section>

            <section>
              <h2 className="text-24 font-semibold mb-4">5. Data Retention</h2>
              <p className="text-15 leading-relaxed text-text-secondary">
                We will only retain your personal data for as long as reasonably
                necessary to fulfil the purposes we collected it for, including
                for the purposes of satisfying any legal, regulatory, tax,
                accounting or reporting requirements.
              </p>
            </section>

            <section>
              <h2 className="text-24 font-semibold mb-4">
                6. Your Legal Rights
              </h2>
              <p className="text-15 leading-relaxed text-text-secondary mb-4">
                Under certain circumstances, you have rights under data
                protection laws in relation to your personal data, including the
                right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-15 text-text-secondary ml-4">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Right to withdraw consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-24 font-semibold mb-4">7. Cookies</h2>
              <p className="text-15 leading-relaxed text-text-secondary">
                Our website uses cookies to distinguish you from other users of
                our website. This helps us to provide you with a good experience
                when you browse our website and also allows us to improve our
                site. A cookie is a small file of letters and numbers that we
                store on your browser or the hard drive of your computer if you
                agree.
              </p>
            </section>

            <section>
              <h2 className="text-24 font-semibold mb-4">
                8. Third-Party Links
              </h2>
              <p className="text-15 leading-relaxed text-text-secondary">
                Our website may include links to third-party websites, plug-ins
                and applications. Clicking on those links or enabling those
                connections may allow third parties to collect or share data
                about you. We do not control these third-party websites and are
                not responsible for their privacy statements.
              </p>
            </section>

            <section>
              <h2 className="text-24 font-semibold mb-4">
                9. Changes to This Policy
              </h2>
              <p className="text-15 leading-relaxed text-text-secondary">
                We may update this privacy policy from time to time. We will
                notify you of any changes by posting the new privacy policy on
                this page and updating the "Last updated" date at the top of
                this privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-24 font-semibold mb-4">10. Contact Us</h2>
              <p className="text-15 leading-relaxed text-text-secondary">
                If you have any questions about this Privacy Policy or our
                privacy practices, please contact us at privacy@example.com.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
