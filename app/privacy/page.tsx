import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Ewooral & BFAM Holdings",
  description: "How Ewooral & BFAM Holdings collects, uses, and protects your data.",
};

export default function PrivacyPolicy() {
  return (
    <>
      <Nav />
      <main className="relative z-[1] max-w-[800px] mx-auto px-8 py-24">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent mb-4">
          Legal
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
          Privacy <span className="font-serif italic">Policy</span>
        </h1>
        <p className="text-ink-dim text-sm mb-12">Last updated: May 2026</p>

        <div className="space-y-10 text-[15px] leading-relaxed text-ink-dim">
          <Section title="1. Who we are">
            Ewooral & BFAM Holdings (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a technology company registered in Accra, Ghana. We build and operate digital products including Ahoof&#x25B;, a booking and business management platform, and other software services for businesses across Africa. Contact: admin@ewooral.com.
          </Section>

          <Section title="2. What data we collect">
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Account data:</strong> Name, email address, phone number, business name, and city when you register.</li>
              <li><strong>Booking data:</strong> Customer names, phone numbers, email addresses, appointment dates, services selected, and booking notes submitted through our platform.</li>
              <li><strong>Usage data:</strong> Pages visited, features used, device type, and browser information collected automatically for analytics.</li>
              <li><strong>Communication data:</strong> Messages sent through our notification system (email, SMS, WhatsApp) including delivery status.</li>
            </ul>
          </Section>

          <Section title="3. How we use your data">
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>To provide and improve our services (booking management, notifications, analytics).</li>
              <li>To send booking confirmations, reminders, and service updates via your preferred channels.</li>
              <li>To generate business insights (revenue reports, customer segments, demand forecasting).</li>
              <li>To communicate important changes to our services or policies.</li>
              <li>To prevent fraud and ensure platform security.</li>
            </ul>
          </Section>

          <Section title="4. Who we share data with">
            We do not sell your data. We share data only with:
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>SMS providers</strong> (Arkesel) — to deliver text message notifications.</li>
              <li><strong>WhatsApp / Meta</strong> — to deliver WhatsApp messages via the Cloud API.</li>
              <li><strong>Email provider</strong> (Zoho) — to deliver email notifications.</li>
              <li><strong>Infrastructure providers</strong> — for hosting and database services.</li>
            </ul>
            All third-party providers are bound by their own privacy policies and data processing agreements.
          </Section>

          <Section title="5. Data storage and security">
            Your data is stored on secure servers. We use encryption for data in transit (TLS/SSL), hashed passwords (bcrypt), and role-based access controls. We retain your data for as long as your account is active. You may request deletion at any time.
          </Section>

          <Section title="6. Your rights">
            You have the right to:
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data and account.</li>
              <li>Opt out of marketing communications at any time.</li>
              <li>Export your data in a portable format.</li>
            </ul>
            To exercise any of these rights, contact us at admin@ewooral.com.
          </Section>

          <Section title="7. Cookies">
            We use essential cookies for authentication and session management. We do not use third-party tracking cookies.
          </Section>

          <Section title="8. Children">
            Our services are not directed to children under 13. We do not knowingly collect personal data from children.
          </Section>

          <Section title="9. Changes to this policy">
            We may update this policy from time to time. We will notify registered users of significant changes via email. Continued use of our services after changes constitutes acceptance.
          </Section>

          <Section title="10. Contact">
            For privacy inquiries, contact us at:
            <div className="mt-2">
              <strong>Ewooral & BFAM Holdings</strong><br />
              Accra, Ghana<br />
              admin@ewooral.com
            </div>
          </Section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-bold text-ink mb-3">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
