import Logo from "./Logo";
import SocialLinks from "./SocialLinks";
import { CONTACTS, SITE_NAME, STORE } from "@/lib/seo";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t border-black/5 bg-brand-night text-white/80 sm:mt-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:gap-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:px-8">
        <div className="col-span-2 lg:col-span-1">
          {/* No wrapper plate here — Logo carries its own logo-matched
              surface, so a white box would only add a second seam. */}
          <Logo tone="dark" />
          <p className="mt-3 max-w-xs text-xs text-white/60 sm:mt-4 sm:text-sm">
            Ladies 3 piece &amp; 2 piece suits and kurtis. Fresh seasonal
            designs, premium fabric, fast delivery all across Pakistan. ✨
          </p>
        </div>

        <div>
          <h3 className="mb-2 font-display text-xs font-bold uppercase tracking-wider text-white sm:mb-4 sm:text-sm">
            Get in touch
          </h3>
          <ul className="space-y-1.5 text-xs sm:space-y-3 sm:text-sm">
            {CONTACTS.map((c) => (
              <li key={c.intl}>
                <a
                  href={`https://wa.me/${c.intl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-brand-orange"
                >
                  <span aria-hidden>📱</span> {c.name} — {c.display}
                </a>
              </li>
            ))}
            <li className="text-white/60">{STORE.address}</li>
          </ul>
          <SocialLinks className="mt-4" tone="dark" />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1.5 px-4 py-4 text-[11px] text-white/50 sm:flex-row sm:gap-2 sm:py-6 sm:text-xs sm:px-6 lg:px-8">
          <p>
            © {year} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
