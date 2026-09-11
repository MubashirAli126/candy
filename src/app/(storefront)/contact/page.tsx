import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import SocialLinks from "@/components/SocialLinks";
import { CONTACTS, SITE_NAME, STORE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${SITE_NAME} for custom stitching, bulk orders and support. WhatsApp us or visit us in Karachi.`,
  alternates: { canonical: "/contact" },
};

const WHATSAPP = STORE.whatsapp;

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <SectionHeading
        as="h1"
        eyebrow="We are listening"
        title="Get in touch"
        subtitle="Questions, custom orders or bulk inquiries — we reply on WhatsApp within working hours."
      />

      {/* Phone numbers */}
      <div className="mt-9 grid gap-px border border-brand-ink/10 bg-brand-ink/10 sm:mt-12 sm:grid-cols-2">
        {CONTACTS.map((c) => (
          <a
            key={c.intl}
            href={`https://wa.me/${c.intl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-brand-ivory p-7 text-center transition-colors hover:bg-brand-cream sm:p-8"
          >
            <p className="eyebrow">{c.name}</p>
            <p className="mt-3 font-display text-2xl text-brand-ink transition-colors group-hover:text-brand-plum">
              {c.display}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-brand-inkMuted">
              Call or WhatsApp
            </p>
          </a>
        ))}
      </div>

      {/* Shop + socials */}
      <div className="mt-px grid gap-px border border-t-0 border-brand-ink/10 bg-brand-ink/10 sm:grid-cols-2">
        <div className="bg-brand-ivory p-7 text-center sm:p-8">
          <p className="eyebrow">Visit the shop</p>
          <p className="mt-3 text-sm leading-relaxed text-brand-inkSoft">
            {STORE.address}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-brand-inkMuted">
            Mon–Sat · 10:00 AM – 08:00 PM
          </p>
        </div>
        <div className="flex flex-col items-center bg-brand-ivory p-7 text-center sm:p-8">
          <p className="eyebrow">Follow along</p>
          <SocialLinks className="mt-4" showHandle />
        </div>
      </div>

      {/* Custom stitching CTA */}
      <section className="mt-12 bg-brand-night bg-brand-paper px-6 py-10 sm:mt-16 sm:px-12 sm:py-14">
        <SectionHeading
          tone="dark"
          eyebrow="Made to measure"
          title="Want something stitched to your size?"
          subtitle="Send us your measurements or a design you like on WhatsApp and we'll stitch it for you. Bulk and boutique orders welcome."
        />
        <div className="mt-7 text-center">
          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
              "Hi! I'd like a custom stitched outfit."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold"
          >
            Message us now
          </a>
        </div>
      </section>
    </div>
  );
}
