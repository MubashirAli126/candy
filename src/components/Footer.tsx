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
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-goldSoft">
        {title}
      </h3>
      <span className="mt-3 block h-px w-8 bg-brand-gold/50" aria-hidden="true" />
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-white/60 transition-colors hover:text-white"
            >
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
    <footer className="border-t border-brand-gold/25 bg-brand-night bg-brand-paper text-white/70">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-5 lg:px-8">
        {/* Brand blurb */}
        <div className="col-span-2 lg:col-span-1">
          {/* tone="dark" — the mark is red on cream in the artwork, so it
              brings its own cream plate rather than sitting on the plum. */}
          <Logo tone="dark" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
            Ladies 3 piece &amp; 2 piece suits and kurtis — cut, stitched and
            packed in Karachi, delivered all across Pakistan.
          </p>
          <SocialLinks className="mt-6" tone="dark" />
        </div>

        <LinkColumn title="My Account" links={FOOTER_ACCOUNT} />
        <LinkColumn title="Policies" links={FOOTER_POLICIES} />
        <LinkColumn title="Information" links={FOOTER_INFORMATION} />

        {/* Contact details */}
        <div className="col-span-2 lg:col-span-1">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-goldSoft">
            Contact
          </h3>
          <span
            className="mt-3 block h-px w-8 bg-brand-gold/50"
            aria-hidden="true"
          />
          <ul className="mt-4 space-y-2.5 text-sm">
            {CONTACTS.map((c) => (
              <li key={c.intl}>
                <a
                  href={`https://wa.me/${c.intl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  <span className="block text-[0.7rem] uppercase tracking-[0.16em] text-white/40">
                    {c.name}
                  </span>
                  {c.display}
                </a>
              </li>
            ))}
            <li className="pt-1 leading-relaxed text-white/50">
              {STORE.address}
            </li>
            <li className="text-white/50">Mon–Sat · 10:00 AM – 08:00 PM</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/40 sm:flex-row sm:px-6 sm:py-6 lg:px-8">
          <p>
            © {year} {SITE_NAME}. All rights reserved.
          </p>
          <p className="uppercase tracking-[0.16em]">
            Cash on delivery · Nationwide shipping
          </p>
        </div>
      </div>
    </footer>
  );
}
