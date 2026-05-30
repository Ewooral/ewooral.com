import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Join Ewooral — Updates without the noise",
  description:
    "Product launches, opportunities, and events that fit your interests. Nothing else.",
  alternates: { canonical: "https://ewooral.com/register" },
  openGraph: {
    title: "Join Ewooral — Updates without the noise",
    description:
      "Product launches, opportunities, and events that fit your interests. Nothing else.",
    url: "https://ewooral.com/register",
    type: "website",
  },
  robots: { index: true, follow: true },
};

type SearchParams = Promise<{
  next?: string;
  email?: string;
  source?: string;
  action?: string;
}>;

const ACTION_HINTS: Record<string, string> = {
  like: "Sign in to like this post.",
  comment: "Sign in to join the conversation.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const nextPath = typeof sp.next === "string" ? sp.next : null;
  const prefillEmail = typeof sp.email === "string" ? sp.email : "";
  const signupSource = typeof sp.source === "string" ? sp.source : "general";
  const actionHint =
    typeof sp.action === "string" ? ACTION_HINTS[sp.action] : null;

  return (
    <>
      <Nav />
      <main className="min-h-screen pb-32 pt-28 md:pt-36">
        <section className="max-w-3xl mx-auto px-5 md:px-10">
          <header className="mb-12 md:mb-16 text-center">
            {actionHint && (
              <div
                className="inline-block mb-6 px-4 py-2 rounded-full font-mono text-[11px] uppercase tracking-[0.18em]"
                style={{
                  background: "rgba(245,184,32,0.08)",
                  border: "1px solid rgba(245,184,32,0.3)",
                  color: "var(--color-accent)",
                }}
              >
                {actionHint}
              </div>
            )}
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] mb-5 text-accent">
              Ewooral · Join
            </div>
            <h1
              className="font-display font-display-tight leading-[1.0] mb-6"
              style={{
                fontSize: "clamp(2.4rem, 5.5vw, 4rem)",
                letterSpacing: "-0.03em",
              }}
            >
              Get Ewooral updates <br className="hidden md:block" />
              without the noise.
            </h1>
            <p
              className="text-ink-dim leading-relaxed max-w-xl mx-auto"
              style={{ fontSize: "clamp(1rem, 1.6vw, 1.15rem)" }}
            >
              Product launches, opportunities, and events that fit your
              interests. Nothing else.
            </p>
          </header>

          <RegisterForm
            prefillEmail={prefillEmail}
            nextPath={nextPath}
            signupSource={signupSource}
          />

          <p className="mt-10 text-center text-[12px] font-mono text-ink-faint tracking-[0.05em]">
            Passwordless · we email you on first signup · unsubscribe anytime.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
