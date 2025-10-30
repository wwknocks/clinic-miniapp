import { Card } from "@/components/ui";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-15 text-text-secondary mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8 text-text-primary">
            <section>
              <h2 className="text-24 font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-15 leading-relaxed text-text-secondary">
                By accessing and using this service, you accept and agree to be
                bound by the terms and provision of this agreement. If you do
                not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-24 font-semibold mb-4">2. Use License</h2>
              <p className="text-15 leading-relaxed text-text-secondary mb-4">
                Permission is granted to temporarily access the materials
                (information or software) on our platform for personal,
                non-commercial transitory viewing only. This is the grant of a
                license, not a transfer of title, and under this license you may
                not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-15 text-text-secondary ml-4">
                <li>Modify or copy the materials</li>
                <li>
                  Use the materials for any commercial purpose, or for any
                  public display (commercial or non-commercial)
                </li>
                <li>
                  Attempt to decompile or reverse engineer any software
                  contained on our platform
                </li>
                <li>
                  Remove any copyright or other proprietary notations from the
                  materials
                </li>
                <li>
                  Transfer the materials to another person or "mirror" the
                  materials on any other server
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-24 font-semibold mb-4">3. Disclaimer</h2>
              <p className="text-15 leading-relaxed text-text-secondary">
                The materials on our platform are provided on an 'as is' basis.
                We make no warranties, expressed or implied, and hereby disclaim
                and negate all other warranties including, without limitation,
                implied warranties or conditions of merchantability, fitness for
                a particular purpose, or non-infringement of intellectual
                property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-24 font-semibold mb-4">4. Limitations</h2>
              <p className="text-15 leading-relaxed text-text-secondary">
                In no event shall we or our suppliers be liable for any damages
                (including, without limitation, damages for loss of data or
                profit, or due to business interruption) arising out of the use
                or inability to use the materials on our platform, even if we or
                our authorized representative has been notified orally or in
                writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-24 font-semibold mb-4">5. Revisions</h2>
              <p className="text-15 leading-relaxed text-text-secondary">
                The materials appearing on our platform could include technical,
                typographical, or photographic errors. We do not warrant that
                any of the materials on our platform are accurate, complete, or
                current. We may make changes to the materials contained on our
                platform at any time without notice. However, we do not make any
                commitment to update the materials.
              </p>
            </section>

            <section>
              <h2 className="text-24 font-semibold mb-4">6. Links</h2>
              <p className="text-15 leading-relaxed text-text-secondary">
                We have not reviewed all of the sites linked to our platform and
                are not responsible for the contents of any such linked site.
                The inclusion of any link does not imply endorsement by us of
                the site. Use of any such linked website is at the user's own
                risk.
              </p>
            </section>

            <section>
              <h2 className="text-24 font-semibold mb-4">
                7. Governing Law
              </h2>
              <p className="text-15 leading-relaxed text-text-secondary">
                These terms and conditions are governed by and construed in
                accordance with the laws and you irrevocably submit to the
                exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h2 className="text-24 font-semibold mb-4">8. Contact Us</h2>
              <p className="text-15 leading-relaxed text-text-secondary">
                If you have any questions about these Terms of Service, please
                contact us at support@example.com.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
