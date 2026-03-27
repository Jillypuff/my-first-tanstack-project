import { LEGAL_PLACEHOLDER } from "@/lib/legal/constants"

function Section({
  id,
  title,
  children,
}: {
  id?: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="space-y-3 border-b border-slate-200 pb-8 last:border-0 last:pb-0">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

export function PrivacyPolicyContent() {
  const p = LEGAL_PLACEHOLDER
  return (
    <>
      <Section title="1. Who we are">
        <p>
          The controller of your personal data is <strong>{p.controllerName}</strong> (a natural
          person). We are based in{" "}
          <strong>{p.controllerCountry}</strong>. For data protection enquiries, contact us at{" "}
          <strong>{p.contactEmail}</strong>.
        </p>
      </Section>

      <Section title="2. What data we process">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Account and authentication:</strong> email address, password (handled by our
            authentication provider; we do not store your password in plain text), and account
            identifiers.
          </li>
          <li>
            <strong>Profile:</strong> data stored in your profile record (for example email used to
            sign in).
          </li>
          <li>
            <strong>Application records:</strong> information you add about job applications, such
            as company name, job title, dates, status, notes, tags, criteria, company details, and
            optional <strong>contact details</strong> about third parties (for example recruiters or
            hiring managers: name, email, phone, notes).
          </li>
          <li>
            <strong>Technical data:</strong> standard server or provider logs where applicable (for
            example IP address, timestamps) as processed by our hosting or authentication providers.
          </li>
          <li>
            <strong>Essential cookies and browser storage:</strong> our authentication provider
            (Supabase) uses cookies and/or local storage in your browser to keep you signed in, to
            protect sessions, and to operate secure login. These are strictly necessary for the
            Service and are not used for marketing or analytics by us. You can remove them by
            clearing site data for this app or by signing out; you may not be able to use the
            Service without them.
          </li>
        </ul>
      </Section>

      <Section title="3. Purposes and legal bases (GDPR Art. 6)">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Performance of a contract (Art. 6(1)(b)):</strong> to provide the service you
            signed up for (account, storing your applications and related content).
          </li>
          <li>
            <strong>Legitimate interests (Art. 6(1)(f)):</strong> where applicable, to secure the
            service, prevent abuse, and improve reliability—balanced against your rights.
          </li>
          <li>
            <strong>Legal obligation (Art. 6(1)(c)):</strong> where we must retain or disclose data
            to comply with law.
          </li>
        </ul>
        <p>
          We do not use your data for automated decision-making or profiling as defined in GDPR
          unless we tell you otherwise and have a valid basis.
        </p>
      </Section>

      <Section id="third-party-contacts" title="4. Contacts you add about other people">
        <p>
          When you use features that store <strong>contact information about third parties</strong>{" "}
          (for example a recruiter&apos;s name, email, or phone), you are providing personal data
          about individuals other than yourself. We process that information to host and display it
          as part of your application records on your instructions and as needed to run the
          service.
        </p>
        <p>You agree to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Only add contact details you are allowed to process for your job search (for example
            professional or business contact information you have legitimately obtained).
          </li>
          <li>
            Not use the service to collect or store unnecessary sensitive categories of data about
            others unless you have a clear legal basis and we have agreed any extra safeguards
            where required.
          </li>
          <li>
            Inform relevant third parties where required by applicable law (this may be your
            responsibility depending on context—seek advice if unsure).
          </li>
        </ul>
        <p>
          Third parties may contact us to exercise their data protection rights; we will respond in
          line with GDPR and our Terms of Service.
        </p>
      </Section>

      <Section title="5. Recipients and subprocessors">
        <p>
          We use service providers to run this application. In particular, we use{" "}
          <strong>Supabase</strong> for authentication and database storage. Data is processed in
          connection with your project configuration (region: <strong>{p.hostingRegion}</strong>).
        </p>
        <p>
          Supabase acts as a processor under our instructions where applicable. See Supabase&apos;s
          documentation for their Data Processing Agreement and sub-processors list.
        </p>
      </Section>

      <Section title="6. International transfers">
        <p>
          If personal data is transferred outside the European Economic Area, we rely on appropriate
          safeguards such as Standard Contractual Clauses or adequacy decisions, as offered by our
          providers and as configured in your project. Confirm the details with your hosting setup
          and document them here after review with counsel.
        </p>
      </Section>

      <Section title="7. Retention">
        <p>
          We keep your data while your account is active and as needed to provide the service. If
          you delete your account or ask us to erase your data, we will delete or anonymise personal
          data unless we must keep certain information to comply with law. Backup copies may persist
          for a limited period according to provider practices.
        </p>
      </Section>

      <Section title="8. Your rights (EEA/UK)">
        <p>Depending on applicable law, you may have the right to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Access your personal data.</li>
          <li>Rectify inaccurate data.</li>
          <li>Erase data (&quot;right to be forgotten&quot;) in certain cases.</li>
          <li>Restrict or object to processing in certain cases.</li>
          <li>Data portability for data you provided, where processing is automated and based on
            contract or consent.</li>
          <li>Lodge a complaint with a supervisory authority.</li>
        </ul>
        <p>
          <strong>Data portability in practice:</strong> there is no self-service “export” button
          in the app at present. If you wish to receive a copy of your personal data in a structured,
          commonly used format where applicable, contact us at <strong>{p.contactEmail}</strong>{" "}
          and we will respond within a reasonable time in line with applicable law.
        </p>
        <p>
          To exercise any of your rights, contact us at <strong>{p.contactEmail}</strong>. We may
          need to verify your identity before responding.
        </p>
      </Section>

      <Section title="9. Security">
        <p>
          We implement appropriate technical and organisational measures appropriate to the risk,
          including transport encryption where supported by the platform and access controls. No
          method of transmission or storage is completely secure.
        </p>
      </Section>

      <Section title="10. Children">
        <p>
          The service is not directed at children under the age where parental consent is required
          in your jurisdiction. Do not register if you do not meet the minimum age.
        </p>
      </Section>

      <Section title="11. Changes">
        <p>
          We may update this Privacy Policy. We will indicate the date of the latest version at the
          top or bottom of this page and, where appropriate, notify you (for example by email or
          in-app notice) before material changes take effect.
        </p>
      </Section>
    </>
  )
}
