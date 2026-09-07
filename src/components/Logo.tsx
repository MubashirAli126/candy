import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";

/**
 * Confetti dots scattered around the wordmark, in `em` so they track the font
 * size. `x`/`y` are offsets from the wordmark's text box; `r` is the radius.
 */
const DOTS = [
  { x: -0.34, y: 0.1, r: 0.13, fill: "#E1252B" },
  { x: -0.2, y: 0.62, r: 0.09, fill: "#FDC10D" },
  { x: 0.16, y: -0.16, r: 0.1, fill: "#22B24C" },
  { x: 0.62, y: -0.26, r: 0.13, fill: "#FDC10D" },
  { x: 1.14, y: -0.14, r: 0.09, fill: "#E1252B" },
  { x: 1.72, y: -0.24, r: 0.12, fill: "#22B24C" },
  { x: 2.28, y: -0.12, r: 0.09, fill: "#FDC10D" },
  { x: 2.66, y: 0.34, r: 0.13, fill: "#E1252B" },
];

/**
 * Candy brand mark — the lowercase wordmark ringed by the confetti dots from
 * the shop's business card.
 *
 * Drawn inline rather than loaded from /public so it stays crisp on white
 * headers and dark plum footers alike, with no image request on first paint.
 *
 * The dots bleed outside the text box, so an `em` padding ring reserves room
 * for them — without it they collide with neighbouring header controls and get
 * clipped by any `overflow-hidden` ancestor.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${SITE_NAME} — Home`}
      className={`group -m-2 inline-flex min-w-0 select-none items-center rounded-2xl p-2 outline-none transition-[transform,background-color] duration-200 hover:bg-brand-logoRed/[0.04] focus-visible:ring-2 focus-visible:ring-brand-logoRed/50 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 ${className}`}
    >
      {/* Padding ring: reserves layout space for the confetti bleed. */}
      <span className="inline-block pl-[0.5em] pr-[0.2em] pt-[0.4em] leading-none">
        <span className="relative inline-block font-display text-2xl font-extrabold lowercase tracking-tight text-brand-logoRed sm:text-3xl">
          {/* Confetti dots, positioned against the text box. */}
          <span aria-hidden="true">
            {DOTS.map((d, i) => (
              <span
                key={i}
                className="pointer-events-none absolute rounded-full transition-transform duration-300 ease-out group-hover:scale-125 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                style={{
                  left: `${d.x - d.r}em`,
                  top: `${d.y - d.r}em`,
                  width: `${d.r * 2}em`,
                  height: `${d.r * 2}em`,
                  background: d.fill,
                  transitionDelay: `${i * 25}ms`,
                }}
              />
            ))}
          </span>
          <span className="relative">candy</span>
        </span>
      </span>
    </Link>
  );
}
