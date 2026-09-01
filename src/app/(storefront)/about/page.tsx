import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_NAME_SHORT } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Asad Sticker & Auto Zone (Gul Plaza, Karachi) has been crafting premium stickers for 15+ years — bikes, cars, walls, and trusted fleet partners like Chhipa Ambulance, Police & Rangers. Nationwide delivery across Pakistan.",
  alternates: { canonical: "/about" },
};

const CATEGORIES = [
  { icon: "🏍️", label: "Bikes & Heavy Bikes" },
  { icon: "🚲", label: "Cycles" },
  { icon: "🚗", label: "Cars & Sports Cars" },
  { icon: "🛏️", label: "Bedroom Walls" },
  { icon: "🛋️", label: "Drawing Room Walls" },
  { icon: "🍳", label: "Kitchen Walls" },
  { icon: "🎉", label: "Special Event Builds" },
  { icon: "✨", label: "Fully Custom Ideas" },
];

const CLIENTS = [
  "Chhipa Ambulance",
  "Ambulance Fleets",
  "Police",
  "Rangers",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="text-center">
        <h1 className="font-display text-3xl font-extrabold text-brand-dark sm:text-4xl">
          About <span className="text-shine">{SITE_NAME}</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:mt-4 sm:text-lg">
          We're on a mission to help Pakistan express itself — one shiny sticker
          at a time. Chamka do apni dunya! ✨
        </p>
      </header>

      <div className="mt-8 space-y-6 text-gray-700 sm:mt-12 sm:space-y-8">
        <p>
          {SITE_NAME} started with a simple idea: high-quality, affordable
          stickers that actually last. Whether you want to give your car a
          sporty makeover, personalize your bike, or transform a plain wall into
          something beautiful — we've got you covered.
        </p>
        <p>
          Every sticker we make uses <strong>premium weather-proof vinyl</strong>{" "}
          that survives sun, rain and washing. Our designs are precision-cut,
          bubble-free, and easy to apply. And if you have a custom idea, just
          send it over — we love a good challenge.
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: "🎨", title: "Custom designs", text: "Your idea, our vinyl." },
            { icon: "💧", title: "Weatherproof", text: "Built to last for years." },
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

      {/* Our Story — the real one */}
      <section className="mt-12 overflow-hidden rounded-3xl bg-brand-dark p-6 text-white sm:mt-16 sm:p-10">
        <span className="inline-block rounded-full bg-brand-gradient px-4 py-1 text-sm font-bold text-brand-dark">
          15+ Years Strong
        </span>
        <h2 className="mt-4 font-display text-2xl font-extrabold sm:text-3xl">
          From <span className="text-shine">Gul Plaza, Karachi</span> to all of
          Pakistan
        </h2>
        <div className="mt-4 space-y-4 text-gray-300">
          <p>
            Our story doesn't start online — it starts at{" "}
            <strong className="text-white">Gul Plaza, Karachi</strong>, where our
            shop <strong className="text-white">{SITE_NAME_SHORT}</strong> has
            been a household name for nearly{" "}
            <strong className="text-white">15 years</strong>. Ask anyone around
            for "Asad Sticker" and they'll point you straight to us.
          </p>
          <p>
            <strong className="text-white">{SITE_NAME}</strong> is that same
            trusted workshop, now online — the same hands, the same quality and
            the same 15-year reputation, just a tap away wherever you are in
            Pakistan.
          </p>
        </div>
      </section>

      {/* What we make */}
      <section className="mt-12 sm:mt-16">
        <h2 className="text-center font-display text-2xl font-extrabold text-brand-dark sm:text-3xl">
          What We Make
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
          If it has a surface, we can make it shine. Every type of sticker,
          designed and cut in-house.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CATEGORIES.map((c) => (
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

      {/* Trusted by */}
      <section className="mt-12 rounded-3xl border border-black/5 bg-brand-mist p-6 sm:mt-16 sm:p-10">
        <h2 className="text-center font-display text-2xl font-extrabold text-brand-dark sm:text-3xl">
          Trusted by Pakistan's Frontline
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
          Our work isn't just for show. We're proud to be the sticker partner of
          choice for the fleets and forces that keep the country moving.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {CLIENTS.map((client) => (
            <span
              key={client}
              className="rounded-full border border-brand-dark/10 bg-white px-5 py-2 font-semibold text-brand-dark shadow-card"
            >
              {client}
            </span>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          Planning something big? We also build special custom bikes and cars for
          events — ready when you are. 🎉
        </p>
      </section>

      {/* Installation & delivery */}
      <section className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2">
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
          <div className="text-4xl">🛠️</div>
          <h3 className="mt-3 font-display text-lg font-bold text-brand-dark">
            Installation in Karachi
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Want it fitted for you? We come to you anywhere in Karachi and apply
            your stickers professionally. A small on-site fee applies depending
            on your location — just ask us before you order.
          </p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
          <div className="text-4xl">📦</div>
          <h3 className="mt-3 font-display text-lg font-bold text-brand-dark">
            Delivery Across Pakistan
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Outside Karachi? No problem. We deliver your stickers anywhere in
            Pakistan. Application is quick and easy — you'll apply them yourself
            with our simple, bubble-free vinyl.
          </p>
        </div>
      </section>

      <div className="mt-12 text-center sm:mt-16">
        <Link
          href="/products"
          className="inline-block rounded-full bg-brand-gradient px-8 py-4 font-bold text-brand-dark shadow-brand"
        >
          Explore our stickers
        </Link>
      </div>
    </div>
  );
}
