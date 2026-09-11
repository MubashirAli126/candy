import { cn } from "@/lib/utils";

const PROMISES = [
  {
    title: "Stitched in-house",
    text: "Cut, sewn and checked in our own Karachi studio.",
  },
  {
    title: "Premium fabric",
    text: "Colour-fast lawn, linen, khaddar and organza.",
  },
  {
    title: "Dispatched in 24h",
    text: "Delivered anywhere in Pakistan in 3–5 days.",
  },
  {
    title: "Cash on delivery",
    text: "Pay the courier when the parcel reaches you.",
  },
];

/**
 * The four things a buyer wants to know before scrolling a grid. Typeset
 * rather than illustrated — numerals and hairlines, no icon soup — which is
 * what keeps the strip on the classic side of the design.
 */
export default function AssuranceStrip({ className }: { className?: string }) {
  return (
    <section
      className={cn("border-y border-brand-ink/10 bg-brand-cream", className)}
      aria-label="Why shop with Candy"
    >
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-brand-ink/10 sm:px-6 lg:grid-cols-4 lg:px-8">
        {PROMISES.map((p, i) => (
          <li key={p.title} className="bg-brand-cream px-5 py-5 sm:px-6 sm:py-7">
            <span className="font-display text-sm italic text-brand-gold">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2 font-display text-lg leading-snug text-brand-ink">
              {p.title}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-brand-inkSoft sm:text-sm">
              {p.text}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
