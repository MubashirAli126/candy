"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SITE_NAME } from "@/lib/seo";

/**
 * Asad Sticker & Auto Zone logo.
 *
 * /public/logo.png is transparent and cropped to the artwork, so it drops
 * straight onto white headers and dark footers with no backing plate.
 *
 * If the file is missing, a colour-matched inline SVG mark takes over.
 */
export default function Logo({
  className = "",
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  const [useFallback, setUseFallback] = useState(false);

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 group ${className}`}
      aria-label={`${SITE_NAME} — Home`}
    >
      {!useFallback ? (
        <span className="inline-flex">
          {/* next/image so the 780 KB source is resized + served as webp —
              the raw file was slow enough to look "missing" on mobile data. */}
          <Image
            src="/logo.png"
            alt={`${SITE_NAME} — Sticker for every surface`}
            width={888}
            height={597}
            priority
            sizes="(max-width: 640px) 128px, 176px"
            className="h-14 w-auto transition-transform group-hover:scale-105 sm:h-16"
            onError={() => setUseFallback(true)}
          />
        </span>
      ) : (
        // Colour-matched fallback mark
        <>
          <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-brand-gradient shadow-brand ring-1 ring-brand-dark/80 transition-transform group-hover:scale-105">
            <span className="absolute right-0 bottom-0 h-3 w-3 rounded-br-xl rounded-tl-sm bg-brand-dark/80" />
            <svg viewBox="0 0 40 40" className="h-6 w-6" aria-hidden="true">
              <path
                d="M20 4 L24 16 L36 20 L24 24 L20 36 L16 24 L4 20 L16 16 Z"
                fill="#0E1B33"
              />
            </svg>
          </span>
          {showText && (
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-extrabold tracking-wide text-brand-dark">
                ASAD
              </span>
              <span className="mt-0.5 bg-brand-gradient bg-clip-text text-[10px] font-bold tracking-[0.18em] text-transparent">
                STICKER &amp; AUTO ZONE
              </span>
            </span>
          )}
        </>
      )}
    </Link>
  );
}
