import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";

/**
 * Confetti dots scattered around the wordmark, following the printed artwork:
 * an arc riding just over the letters, plus the big red dot and its yellow
 * partner tucked down the left of the `c`.
 *
 *   x — fraction of the wordmark's own width, so the arc stays spread across
 *       the letters whatever face `font-logo` resolves to. Rounded faces differ
 *       by enough ("candy" is 2.66em in Fredoka, 2.89em in M PLUS Rounded 1c)
 *       that fixed `em` offsets drift the last dot back over the `y`.
 *   y — `em` from the top of the text box down to the dot's centre.
 *   r — radius in `em`.
 *
 * `y` is measured against the ink, not the text box: at `leading-none` the box
 * is a full em tall while the letters sit inside it. For Fredoka 700:
 *
 *   0.135em  top of the `d` ascender
 *   0.353em  top of `c` / `a` / `n` / `y` (x-height)
 *   0.869em  baseline
 *   1.103em  bottom of the `y` tail  (0.103em past the box, hence `pb`)
 *
 * The arc is all but flat — its lower edge runs `0.231 - 0.045·sin(πx)`, which
 * holds a steady 0.13–0.17em of air over the x-height. The letters share one
 * flat top line, so a deeper curve would leave the middle dots floating while
 * the end ones crowded the letters.
 *
 * Letter cells, as fractions of the width: c 0–0.18, a 0.18–0.38, n 0.38–0.59,
 * d 0.59–0.79, y 0.79–1. No dot goes over the `d` ascender's stem at
 * 0.68–0.79; the letter rises through the gap between two dots instead, which
 * is what lets the arc stay this close to the word. Lifting the dots clear of
 * the ascender instead leaves them visibly floating above everything else.
 */
const DOTS = [
  // The pair down the left of the `c`.
  { x: -0.11, y: 0.425, r: 0.13, fill: "#E1252B" },
  { x: -0.05, y: 0.849, r: 0.085, fill: "#FDC10D" },
  // The arc across the top, spread over the full width of the wordmark.
  { x: 0.05, y: 0.104, r: 0.12, fill: "#22B24C" },
  { x: 0.195, y: 0.115, r: 0.09, fill: "#FDC10D" },
  { x: 0.34, y: 0.042, r: 0.15, fill: "#E1252B" },
  { x: 0.48, y: 0.086, r: 0.1, fill: "#22B24C" },
  { x: 0.6, y: 0.058, r: 0.13, fill: "#FDC10D" },
  { x: 0.86, y: 0.117, r: 0.095, fill: "#E1252B" },
  { x: 0.955, y: 0.15, r: 0.075, fill: "#22B24C" },
];
/**
 * Candy brand mark — the lowercase wordmark ringed by the confetti dots from
 * the shop's business card.
 *
 * Drawn inline rather than loaded from /public so it stays crisp at every size
 * with no image request on first paint. The square badge companion to it lives
 * at /public/logo.svg, for the places that need a standalone file.
 *
 * The artwork is red on cream, so on a dark surface (`tone="dark"`) the mark
 * carries its own cream plate. Red directly on the plum footer both loses the
 * printed look and drops the wordmark to roughly 3:1 against its background.
 *
 * The dots and the `y` tail bleed outside the text box, so an `em` padding ring
 * reserves room for them — without it they collide with neighbouring header
 * controls and get clipped by any `overflow-hidden` ancestor.
 */
export default function Logo({
  className = "",
  tone = "light",
}: {
  className?: string;
  /** "dark" for the plum footer and the admin login screen. */
  tone?: "light" | "dark";
}) {
  const plate =
    tone === "dark"
      ? "bg-brand-logobg p-2.5 ring-1 ring-brand-logobgEdge shadow-[0_10px_30px_-14px_rgba(0,0,0,0.65)]"
      : "-m-2 p-2 hover:bg-brand-logoRed/[0.04]";

  return (
    <Link
      href="/"
      aria-label={`${SITE_NAME} — Home`}
      className={`group inline-flex min-w-0 select-none items-center rounded-2xl outline-none transition-[transform,background-color] duration-200 focus-visible:ring-2 focus-visible:ring-brand-logoRed/50 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 ${plate} ${className}`}
    >
      {/* Padding ring: reserves layout space for the confetti and tail bleed. */}
      <span className="inline-block pb-[0.12em] pl-[0.47em] pr-[0.02em] pt-[0.16em] leading-none">
        <span className="relative inline-block font-logo text-2xl font-bold lowercase tracking-[-0.02em] text-brand-logoRed sm:text-3xl">
          {/* Confetti dots, positioned against the wordmark's own box. */}
          <span aria-hidden="true">
            {DOTS.map((d, i) => (
              <span
                key={i}
                className="pointer-events-none absolute rounded-full transition-transform duration-300 ease-out group-hover:scale-125 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                style={{
                  left: `calc(${d.x * 100}% - ${d.r}em)`,
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
