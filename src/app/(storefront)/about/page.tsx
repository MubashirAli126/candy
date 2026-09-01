import type { Metadata } from "next";
import Link from "next/link";
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

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="text-center">
        <h1 className="font-display text-3xl font-extrabold text-brand-dark sm:text-4xl">
          About <span className="text-shine">{SITE_NAME}</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:mt-4 sm:text-lg">
          Ladies clothing that feels as good as it looks — stitched, packed and
          delivered from Karachi to your door. ✨
        </p>
      </header>

      <div className="mt-8 space-y-6 text-gray-700 sm:mt-12 sm:space-y-8">
        <p>
          {SITE_NAME} started with a simple idea: well-stitched everyday suits
          that don&apos;t cost a fortune. Whether you need a light printed lawn
          for a working day, a warm khaddar for winter, or an organza formal for
          a family function — you&apos;ll find it here, ready to wear.
        </p>
        <p>
          Every piece uses <strong>premium, colour-fast fabric</strong> that
          survives real washing, cut and stitched with a neat finish inside and
          out. Prefer your own measurements? Send them over — we stitch to size.
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: "📏", title: "Custom stitching", text: "Your measurements, our needle." },
            { icon: "🧵", title: "Premium fabric", text: "Colour-fast, wash after wash." },
            { icon: "🚚", title: "Nationwide", text: "Fast COD delivery across PK." },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-black/5 bg-white p-6 text-center shadow-card"
            >
              <div className="text-4xl">{f.icon}</div>
              <h3 className="mt-3 font-display font-bold text-brand-dark">
                {f.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{f.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Our Story */}
      <section className="mt-12 overflow-hidden rounded-3xl bg-brand-dark p-6 text-white sm:mt-16 sm:p-10">
        <span className="inline-block rounded-full bg-brand-gradient px-4 py-1 text-sm font-bold text-brand-dark">
          Stitched with care
        </span>
        <h2 className="mt-4 font-display text-2xl font-extrabold sm:text-3xl">
          From our <span className="text-shine">Karachi</span> studio to all of
          Pakistan
        </h2>
        <div className="mt-4 space-y-4 text-gray-300">
          <p>
            <strong className="text-white">{SITE_NAME_SHORT}</strong> chooses the
            fabric, picks the print and stitches every suit in our own Karachi
            studio. Nothing is drop-shipped, so the colour, the fit and the
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
        <h2 className="text-center font-display text-2xl font-extrabold text-brand-dark sm:text-3xl">
          What We Make
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
          Everyday wear to occasion wear — designed, cut and stitched in-house.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {WHAT_WE_MAKE.map((c) => (
            <div
              key={c.label}
              className="flex flex-col items-center rounded-2xl border border-black/5 bg-white p-5 text-center shadow-card"
            >
              <span className="text-3xl">{c.icon}</span>
              <span className="mt-2 text-sm font-semibold text-brand-dark">
                {c.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Fabrics */}
      <section className="mt-12 rounded-3xl border border-black/5 bg-brand-mist p-6 sm:mt-16 sm:p-10">
        <h2 className="text-center font-display text-2xl font-extrabold text-brand-dark sm:text-3xl">
          Fabrics We Work With
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
          Seasonal from the ground up — light and breathable for summer, warm and
          soft for winter.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {FABRICS.map((fabric) => (
            <span
              key={fabric}
              className="rounded-full border border-brand-dark/10 bg-white px-5 py-2 font-semibold text-brand-dark shadow-card"
            >
              {fabric}
            </span>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          Planning a family function? We take bulk and matching-family orders
          too. 🎉
        </p>
      </section>

      {/* Sizes & delivery */}
      <section className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2">
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
          <div className="text-4xl">📏</div>
          <h3 className="mt-3 font-display text-lg font-bold text-brand-dark">
            Sizes & Custom Fit
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Every product lists the sizes it is stitched in — Small through XL
            on most designs. Need something outside that, or your exact
            measurements? Message us before you order and we&apos;ll stitch to
            size.
          </p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
          <div className="text-4xl">📦</div>
          <h3 className="mt-3 font-display text-lg font-bold text-brand-dark">
            Delivery Across Pakistan
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Dispatched within 24 hours and delivered anywhere in Pakistan. Cash
            on delivery — pay only when the parcel reaches you.
          </p>
        </div>
      </section>

      <div className="mt-12 text-center sm:mt-16">
        <Link
          href="/products"
          className="inline-block rounded-full bg-brand-gradient px-8 py-4 font-bold text-brand-dark shadow-brand"
        >
          Explore our collection
        </Link>
      </div>
    </div>
  );
}
