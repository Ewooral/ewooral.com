export default function Footer() {
  return (
    <footer className="py-[60px_40px] border-t border-line bg-bg-2">
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="flex flex-wrap justify-between items-center gap-6">
          <div className="font-mono text-[12px] text-ink-faint">
            &copy; 2025 Ewooral &amp; BFAM Holdings &middot; Accra, Ghana
            &middot; All rights reserved
          </div>
          <ul className="flex gap-6 list-none text-[13px]">
            <li>
              <a
                href="https://wa.me/447888374946"
                className="text-ink-dim no-underline hover:text-accent transition-colors"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/ewooral"
                className="text-ink-dim no-underline hover:text-accent transition-colors"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/company/ewooral-bfam-holdings"
                className="text-ink-dim no-underline hover:text-accent transition-colors"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://github.com/ewooral"
                className="text-ink-dim no-underline hover:text-accent transition-colors"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
