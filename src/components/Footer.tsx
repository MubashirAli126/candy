import Link from "next/link";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";
import {
  FOOTER_ACCOUNT,
  FOOTER_INFORMATION,
  FOOTER_POLICIES,
  type SiteLink,
} from "@/lib/site-links";
import { CONTACTS, SITE_NAME, STORE } from "@/lib/seo";

/** One footer column — heading plus its list of links. */
function LinkColumn({ title, links }: { title: string; links: SiteLink[] }) {
  return (
    <div>
      <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-white sm:mb-4">
        {title}
      </h3>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-white/70 hover:text-brand-rose">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 bg-brand-night text-white/80 sm:mt-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-5 lg:px-8">
        {/* Brand blurb */}
        <div className="col-span-2 lg:col-span-1">
          {/* No wrapper plate here — Logo carries its own logo-matched
              surface, so a white box would only add a second seam. */}
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-white/60 sm:mt-4">
            Ladies 3 piece &amp; 2 piece suits and kurtis. Fresh seasonal
            designs, premium fabric, fast delivery all across Pakistan. ✨
          </p>
          <SocialLinks className="mt-4" tone="dark" />
        </div>

        <LinkColumn title="My Account" links={FOOTER_ACCOUNT} />
        <LinkColumn title="Company Policies" links={FOOTER_POLICIES} />
        <LinkColumn title="Information" links={FOOTER_INFORMATION} />

        {/* Contact details */}
        <div className="col-span-2 lg:col-span-1">
          <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-white sm:mb-4">
            Contact Details
          </h3>
          <ul className="space-y-2 text-sm">
            {CONTACTS.map((c) => (
              <li key={c.intl}>
                <a
                  href={`https://wa.me/${c.intl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/70 hover:text-brand-rose"
                >
                  <span aria-hidden>📱</span> {c.name} — {c.display}
                </a>
              </li>
            ))}
            <li className="text-white/60">{STORE.address}</li>
            <li className="text-white/60">Mon–Sat, 10:00 AM to 08:00 PM</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1.5 px-4 py-4 text-xs text-white/50 sm:flex-row sm:gap-2 sm:px-6 sm:py-6 lg:px-8">
          <p>
            © {year} {SITE_NAME}. All rights reserved.
          </p>
          <p>Cash on delivery · Nationwide shipping across Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
