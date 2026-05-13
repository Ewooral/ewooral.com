import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Ewooral & BFAM Holdings",
  description: "Terms and conditions for using Ewooral & BFAM Holdings services.",
};

export default function TermsOfService() {
  return (
    <>
      <Nav />
      <main className="relative z-[1] max-w-[800px] mx-auto px-8 py-24">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent mb-4">
          Legal
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
          Terms of <span className="font-serif italic">Service</span>
        </h1>
        <p className="text-ink-dim text-sm mb-12">Last updated: May 2024</p>

        <div className="space-y-10 text-[15px] leading-relaxed text-ink-dim">
          <Section title="1. Agreement">
            By accessing or using any service operated by Ewooral & BFAM Holdings (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), including the Ahoof&#x25B; platform, our website at ewooral.com, and any associated applications, you agree to be bound by these Terms of Service. If you do not agree, do not use our services.
          </Section>

          <Section title="2. Services">
            We provide technology products and services including:
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Ahoof&#x25B;</strong> — a booking and business management platform for salons, barbershops, clinics, and other service businesses.</li>
              <li><strong>Agency services</strong> — web design, branding, and digital solutions for businesses.</li>
              <li><strong>Other products</strong> — as listed on our website.</li>
            </ul>
          </Section>

          <Section title="3. Accounts">
            You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. You must be at least 18 years old to create a business account.
          </Section>

          <Section title="4. Acceptable use">
            You agree not to:
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Use our services for any unlawful purpose.</li>
              <li>Send spam or unsolicited messages through our notification system.</li>
              <li>Attempt to gain unauthorized access to our systems.</li>
              <li>Upload malicious code or content.</li>
              <li>Resell or redistribute our services without permission.</li>
              <li>Misrepresent your identity or business.</li>
            </ul>
          </Section>

          <Section title="5. Pricing and payments">
            Our free tier is available at no cost. Paid plans (Starter, Pro, Business) are billed monthly. Prices are listed in Ghana Cedis (GH&#x20B5;) and are subject to change with 30 days notice. Refunds are available within 7 days of payment if the service has not been substantially used.
          </Section>

          <Section title="6. Data ownership">
            You own your business data. We do not claim ownership of any data you submit, including customer records, booking history, or business information. You may export or delete your data at any time. See our <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a> for details on how we handle data.
          </Section>

          <Section title="7. Notifications and messaging">
            Our platform sends notifications (email, SMS, WhatsApp) on your behalf to your customers. By using our notification features, you confirm that you have the necessary consent from your customers to contact them. You are responsible for the content of any custom messages sent through our platform.
          </Section>

          <Section title="8. Availability">
            We aim for high availability but do not guarantee uninterrupted service. We may perform maintenance with reasonable notice. We are not liable for losses caused by service interruptions beyond our control.
          </Section>

          <Section title="9. Intellectual property">
            Our platform, code, design, and branding are owned by Ewooral & BFAM Holdings. You may not copy, modify, or reverse-engineer our software. Your use of our services does not grant you any intellectual property rights in our platform.
          </Section>

          <Section title="10. Termination">
            Either party may terminate the relationship at any time. You can delete your account from the settings page or by contacting us. We may suspend or terminate accounts that violate these terms, with notice where possible. Upon termination, your data will be deleted within 30 days unless you request an export.
          </Section>

          <Section title="11. Limitation of liability">
            To the maximum extent permitted by law, Ewooral & BFAM Holdings shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
          </Section>

          <Section title="12. Governing law">
            These terms are governed by the laws of the Republic of Ghana. Any disputes shall be resolved in the courts of Accra, Ghana.
          </Section>

          <Section title="13. Changes">
            We may update these terms from time to time. We will notify registered users of material changes via email at least 14 days before they take effect.
          </Section>

          <Section title="14. Contact">
            Questions about these terms? Contact us at:
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
