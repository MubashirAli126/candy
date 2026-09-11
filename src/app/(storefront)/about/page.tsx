import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { SITE_NAME, SITE_NAME_SHORT } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Candy is a Karachi-based ladies clothing label — stitched 3 piece suits, 2 piece suits and kurtis in premium lawn, linen, khaddar and organza. Nationwide cash-on-delivery across Pakistan.",
  alternates: { canonical: "/about" },
};

const WHAT_WE_MAKE = [
  { icon: "👗", label: "3 Piece Suits" },
  { icon: "🧵", label: "2 Piece Suits" },
  { icon: "👚", label: "Kurtis" },
  { icon: "🪡", label: "Embroidered Formals" },
  { icon: "🌸", label: "Printed Lawn" },
  { icon: "🧥", label: "Winter Khaddar" },
  { icon: "🧣", label: "Dupattas & Shawls" },
  { icon: "📏", label: "Custom Stitching" },
];

const FABRICS = ["Lawn", "Cotton", "Linen", "Khaddar", "Chiffon", "Organza"];

const PILLARS = [
  {
    title: "Custom stitching",
    text: "Send your measurements and we stitch the outfit to them.",
  },
  {
    title: "Premium fabric",
    text: "Colour-fast cloth that survives real washing, wash after wash.",
  },
  {
    title: "Nationwide delivery",
    text: "Dispatched in 24 hours, cash on delivery anywhere in Pakistan.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <SectionHeading
        as="h1"
        eyebrow="Karachi, Pakistan"
        title={`About ${SITE_NAME}`}
        subtitle="Ladies clothing that feels as good as it looks — stitched, packed and delivered from our own studio to your door."
      />

      <div className="mt-9 space-y-6 text-brand-inkSoft sm:mt-12">
        <p className="font-display text-xl leading-relaxed text-brand-ink sm:text-2xl">
          {SITE_NAME} started with a simple idea: well-stitched everyday suits
          that don&apos;t cost a fortune.
        </p>
        <p>
          A light printed lawn for a working day, a warm khaddar for winter, an
          organza formal for a family function — you&apos;ll find it here, ready
          to wear. Every piece uses{" "}
          <strong className="font-medium text-brand-ink">
            premium, colour-fast fabric
          </strong>{" "}
          that survives real washing, cut and stitched with a neat finish inside
          and out. Prefer your own measurements? Send them over — we stitch to
          size.
        </p>
      </div>

      {/* Three pillars — numbered, hairline-separated, no boxes. */}
      <div className="mt-9 grid gap-px border border-brand-ink/10 bg-brand-ink/10 sm:mt-12 sm:grid-cols-3">
        {PILLARS.map((f, i) => (
          <div key={f.title} className="bg-brand-ivory p-6 sm:p-7">
            <span className="font-display text-sm italic text-brand-gold">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2 font-display text-lg text-brand-ink">
              {f.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-inkSoft">
              {f.text}
            </p>
          </div>
        ))}
      </div>

      {/* Our Story */}
      <section className="mt-12 bg-brand-night bg-brand-paper px-6 py-10 sm:mt-16 sm:px-12 sm:py-14">
        <SectionHeading
          tone="dark"
          eyebrow="Stitched with care"
          title="From our Karachi studio to all of Pakistan"
        />
        <div className="mx-auto mt-6 max-w-xl space-y-4 text-center text-sm leading-relaxed text-white/70 sm:text-base">
          <p>
            <strong className="font-medium text-white">
              {SITE_NAME_SHORT}
            </strong>{" "}
            chooses the fabric, picks the print and stitches every suit in our
            own studio. Nothing is drop-shipped, so the colour, the fit and the
            finish are ours to answer for.
          </p>
          <p>
            Order online and it reaches you anywhere in Pakistan — pay when it
            arrives at your doorstep.
          </p>
        </div>
      </section>

      {/* What we make */}
      <section className="mt-12 sm:mt-16">
        <SectionHeading
          eyebrow="The range"
          title="What We Make"
          subtitle="Everyday wear to occasion wear — designed, cut and stitched in-house."
        />
        <div className="mt-8 grid grid-cols-2 gap-px border border-brand-ink/10 bg-brand-ink/10 sm:mt-10 sm:grid-cols-4">
          {WHAT_WE_MAKE.map((c) => (
            <div
              key={c.label}
              className="flex flex-col items-center gap-2.5 bg-brand-ivory px-4 py-6 text-center"
            >
              <span className="text-2xl" aria-hidden="true">
                {c.icon}
              </span>
              <span className="text-xs uppercase tracking-[0.12em] text-brand-inkSoft">
                {c.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Fabrics */}
      <section className="mt-12 border-y border-brand-ink/10 bg-brand-cream px-6 py-10 sm:mt-16 sm:py-14">
        <SectionHeading
          eyebrow="Materials"
          title="Fabrics We Work With"
          subtitle="Seasonal from the ground up — light and breathable for summer, warm and soft for winter."
        />
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          {FABRICS.map((fabric) => (
            <span
              key={fabric}
              className="border border-brand-gold/40 bg-brand-ivory px-5 py-2 text-xs uppercase tracking-[0.14em] text-brand-inkSoft"
            >
              {fabric}
            </span>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-brand-inkMuted">
          Planning a family function? We take bulk and matching-family orders
          too.
        </p>
      </section>

      {/* Sizes & delivery */}
      <section className="mt-12 grid gap-px border border-brand-ink/10 bg-brand-ink/10 sm:mt-16 sm:grid-cols-2">
        <div className="bg-brand-ivory p-7 sm:p-8">
          <h3 className="font-display text-xl text-brand-ink">
            Sizes &amp; Custom Fit
          </h3>
          <span className="mt-3 block h-px w-10 bg-brand-gold/60" aria-hidden="true" />
          <p className="mt-4 text-sm leading-relaxed text-brand-inkSoft">
            Every product lists the sizes it is stitched in — Small through XL
            on most designs. Need something outside that, or your exact
            measurements? Message us before you order and we&apos;ll stitch to
            size.
          </p>
        </div>
        <div className="bg-brand-ivory p-7 sm:p-8">
          <h3 className="font-display text-xl text-brand-ink">
            Delivery Across Pakistan
          </h3>
          <span className="mt-3 block h-px w-10 bg-brand-gold/60" aria-hidden="true" />
          <p className="mt-4 text-sm leading-relaxed text-brand-inkSoft">
            Dispatched within 24 hours and delivered anywhere in Pakistan. Cash
            on delivery — pay only when the parcel reaches you.
          </p>
        </div>
      </section>

      <div className="mt-12 text-center sm:mt-16">
        <Link href="/products" className="btn btn-primary btn-lg">
          Explore our collection
        </Link>
      </div>
    </div>
  );
}
