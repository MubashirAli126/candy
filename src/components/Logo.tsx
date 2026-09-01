import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";

/** Polka dots from the logo artwork: {cx, cy, r, fill} on a 40×40 viewBox. */
const DOTS = [
  { cx: 9, cy: 8, r: 3, fill: "#E1252B" },
  { cx: 21, cy: 6, r: 2.4, fill: "#22B24C" },
  { cx: 32, cy: 10, r: 3, fill: "#FDC10D" },
  { cx: 6, cy: 20, r: 2.4, fill: "#22B24C" },
  { cx: 34, cy: 22, r: 2.4, fill: "#E1252B" },
  { cx: 10, cy: 32, r: 3, fill: "#FDC10D" },
  { cx: 21, cy: 34, r: 2.4, fill: "#E1252B" },
  { cx: 31, cy: 31, r: 2.6, fill: "#22B24C" },
];

/**
 * Candy brand mark — the polka-dot badge from the shop's business card, with a
 * red star for the one that sits inside the "d" of the printed wordmark.
 *
 * Drawn inline rather than loaded from /public so it stays crisp on white
 * headers and dark plum footers alike, with no image request on first paint.
 */
export default function Logo({
  className = "",
  tone = "light",
}: {
  className?: string;
  /** "dark" for the plum footer, where the tagline must read on dark. */
  tone?: "light" | "dark";
}) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label={`${SITE_NAME} — Home`}
    >
      <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-white shadow-card ring-1 ring-black/5 transition-transform group-hover:scale-105">
        <svg viewBox="0 0 40 40" className="h-12 w-12" aria-hidden="true">
          <circle cx="20" cy="20" r="20" fill="#FFFFFF" />
          {DOTS.map((d, i) => (
            <circle key={i} {...d} />
          ))}
          {/* The star that sits inside the "d" on the printed logo. */}
          <circle cx="20" cy="20" r="8.5" fill="#E1252B" />
          <path
            d="M20 14.6 L21.7 18.2 L25.6 18.7 L22.8 21.5 L23.5 25.4 L20 23.5 L16.5 25.4 L17.2 21.5 L14.4 18.7 L18.3 18.2 Z"
            fill="#FFFFFF"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-3xl font-extrabold lowercase tracking-tight text-brand-logoRed">
          candy
        </span>
        <span
          className={`mt-1 text-[9px] font-bold uppercase tracking-[0.14em] ${
            tone === "dark" ? "text-white/70" : "text-brand-dark/60"
          }`}
        >
          Wholesale Ladies Garments
        </span>
      </span>
    </Link>
  );
}
