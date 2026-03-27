import { Link } from "@tanstack/react-router"
import { LEGAL_PLACEHOLDER } from "@/lib/legal/constants"

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3 border-b border-slate-200 pb-8 last:border-0 last:pb-0">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

export function TermsOfServiceContent() {
  const p = LEGAL_PLACEHOLDER
  return (
    <>
      <Section title="1. Who we are">
        <p>
          The controller of your personal data is <strong>{p.controllerName}</strong>. 
          We operate from <strong>{p.controllerCity}, {p.controllerCountry}</strong>. 
          To protect the privacy of our operators, our full postal address for formal 
          legal notices is available upon request by emailing <strong>{p.contactEmail}</strong>.
        </p>
      </Section>

      <Section title="2. The Service">
        <p>
          The Service allows you to record and manage information about your job applications,
          including optional features such as contacts, tags, company details, and criteria. Features
          may change over time.
        </p>
      </Section>

      <Section title="3. Account">
        <p>
          You must provide accurate registration information and keep your credentials
          confidential. You are responsible for activity under your account, except where failure
          is solely on our side.
        </p>
      </Section>

      <Section title="4. Acceptable use and third-party data">
        <p>You agree not to misuse the Service. In particular, you agree that:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>You will not use the Service for unlawful purposes or in violation of others&apos;
            rights.</li>
          <li>
            Where you enter personal data about <strong>other people</strong> (for example contact
            details of recruiters in the Contacts feature), you confirm that you do so only with an
            appropriate legal basis under applicable data protection law, and that the information
            is limited to what is reasonably needed for your job search.
          </li>
          <li>
            You will not upload unlawful, harassing, or malicious content, or attempt to probe,
            disrupt, or overload the Service.
          </li>
        </ul>
        <p>
          Our{" "}
          <Link to="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500">
            Privacy Policy
          </Link>{" "}
          describes how we process personal data, including third-party contact data you choose to
          store.
        </p>
      </Section>

      <Section title="5. Your content and license">
        <p>
          You retain any ownership rights you have in the content you submit to the Service (for
          example job application notes, company information, and contact details you enter).
          However, you grant us a worldwide, non-exclusive, royalty-free licence to host, store,
          back up, transmit, and display your content <strong>solely for the purpose of providing
          the Service to you</strong>, including as processed by our hosting and authentication
          providers. This licence ends when your content is deleted from our systems, except where
          copies persist for a limited time in backups as described in our{" "}
          <Link to="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500">
            Privacy Policy
          </Link>
          .
        </p>
      </Section>

      <Section title="6. Privacy">
        <p>
          Our{" "}
          <Link to="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500">
            Privacy Policy
          </Link>{" "}
          is incorporated into these Terms by reference. By using the Service, you acknowledge that
          you have read it.
        </p>
      </Section>

      <Section title="7. Disclaimers">
        <p>
          The Service is provided <strong>&quot;as is&quot;</strong> and <strong>&quot;as
          available&quot;</strong> without warranties of any kind, to the fullest extent
          permitted by law. We do not guarantee uninterrupted or error-free operation or that data
          will never be lost; you should keep backups of important information outside the Service.
        </p>
      </Section>

      <Section title="8. Availability and changes to the Service">
        <p>
          We may change, suspend, or discontinue the Service or any feature (including adding or
          removing functionality) at any time, with or without notice and without liability to you,
          except where mandatory law requires otherwise. We do not guarantee any particular uptime
          or service level.
        </p>
      </Section>

      <Section title="9. Limitation of liability">
        <p>
          To the extent permitted by applicable law, we are not liable for any indirect, incidental,
          special, consequential, or punitive damages, or for loss of profits, data, or goodwill,
          arising from your use of the Service. Our total liability for claims arising from the
          Service is limited to the greater of (a) amounts you paid us for the Service in the twelve
          months before the claim or (b) zero if the Service is free—subject to mandatory
          provisions of law that cannot be waived. Some jurisdictions do not allow certain
          limitations; in those cases our liability is limited to the maximum permitted by law.
        </p>
      </Section>

      <Section title="10. Termination and your data">
        <p>
          You may stop using the Service at any time. We may suspend or terminate your access if you
          breach these Terms or if we need to do so for legal, security, or operational reasons.
          Provisions that by their nature should survive (including disclaimers, limitations, licence
          grants where needed to enforce those provisions, and governing law) will survive
          termination.
        </p>
        <p>
          <strong>What happens to your data:</strong> If you delete your account using the
          in-product controls (where available), we delete your profile and application data held
          in our database as described in our{" "}
          <Link to="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500">
            Privacy Policy
          </Link>
          . There is no guaranteed grace period to retrieve data after deletion; you should export
          or copy anything you need before deleting your account. If you need a structured export
          of your personal data before closing your account, contact us at{" "}
          <strong>{p.contactEmail}</strong> first. Authentication data at our provider may require
          separate deletion in line with that provider&apos;s processes.
        </p>
      </Section>

      <Section title="11. Governing law">
        <p>
          These Terms are governed by the laws of <strong>{p.controllerCountry}</strong>, excluding
          conflict-of-law rules that would apply another jurisdiction&apos;s laws, unless mandatory
          consumer protections in your place of residence require otherwise. Courts in your place of
          residence may have jurisdiction over disputes where required by law.
        </p>
      </Section>

      <Section title="12. Contact">
        <p>
          Questions about these Terms: <strong>{p.contactEmail}</strong>.
        </p>
      </Section>
    </>
  )
}
