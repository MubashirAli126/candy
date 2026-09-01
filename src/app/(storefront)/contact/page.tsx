import type { Metadata } from "next";
import SocialLinks from "@/components/SocialLinks";
import { CONTACTS, SITE_NAME, STORE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${SITE_NAME} for custom stitching, bulk orders and support. WhatsApp, email or visit us in Karachi.`,
  alternates: { canonical: "/contact" },
};

const WHATSAPP = STORE.whatsapp;

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="text-center">
        <h1 className="font-display text-3xl font-extrabold text-brand-dark sm:text-4xl">
          Get in touch
        </h1>
        <p className="mt-3 text-gray-600">
          Questions, custom orders or bulk inquiries? We'd love to hear from you.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6">
        {CONTACTS.map((c) => (
          <a
            key={c.intl}
            href={`https://wa.me/${c.intl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-black/5 bg-white p-6 text-center shadow-card transition-transform hover:-translate-y-1"
          >
            <div className="text-4xl">📱</div>
            <h3 className="mt-3 font-display font-bold text-brand-dark">
              {c.name}
            </h3>
            <p className="mt-1 text-sm font-semibold text-brand-logoRed">
              {c.display}
            </p>
            <p className="mt-1 text-xs text-gray-500">Call or WhatsApp</p>
          </a>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-6">
        <a
          href={`mailto:${STORE.email}`}
          className="rounded-2xl border border-black/5 bg-white p-6 text-center shadow-card transition-transform hover:-translate-y-1"
        >
          <div className="text-4xl">✉️</div>
          <h3 className="mt-3 font-display font-bold text-brand-dark">Email</h3>
          <p className="mt-1 text-sm text-brand-purple">{STORE.email}</p>
        </a>
        <div className="rounded-2xl border border-black/5 bg-white p-6 text-center shadow-card">
          <div className="text-4xl">📍</div>
          <h3 className="mt-3 font-display font-bold text-brand-dark">
            Visit our shop
          </h3>
          <p className="mt-1 text-sm text-gray-500">{STORE.address}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-2 rounded-2xl border border-black/5 bg-white p-6 text-center shadow-card sm:mt-6">
        <h3 className="font-display font-bold text-brand-dark">Follow us</h3>
        <SocialLinks showHandle />
      </div>

      <div className="mt-8 rounded-2xl bg-brand-gradient-soft p-6 text-center text-brand-dark shadow-brand sm:mt-10 sm:p-8">
        <h2 className="font-display text-2xl font-extrabold">
          Want something stitched to your size?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-brand-dark/80">
          Send us your measurements or a design you like on WhatsApp and
          we'll stitch it for you. Bulk and boutique orders welcome!
        </p>
        <a
          href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
            "Hi! I'd like a custom stitched outfit."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full bg-white px-8 py-3.5 font-bold text-brand-purple"
        >
          Message us now
        </a>
      </div>
    </div>
  );
}
