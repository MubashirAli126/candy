"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  href?: string;
  cta?: string;
  image: string;
}

const INTERVAL_MS = 5500;

/**
 * Full-bleed banner carousel at the top of the homepage — one collection at a
 * time, auto-advancing, with dots and arrows for manual control. Rotation
 * pauses while the pointer is over the banner so a reader is never cut off.
 *
 * Each slide fills the frame edge to edge (`object-cover`), anchored to the
 * top so a model's face and the top of the outfit always survive the crop.
 * The frame is close to portrait on phones and widens with the viewport, which
 * keeps the crop shallow for the portrait product shots most banners use —
 * upload artwork at least 1600px wide for a sharp desktop banner.
 */
export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count]
  );

  useEffect(() => {
    if (paused || count < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, count]);

  if (count === 0) return null;

  return (
    <section
      className="relative overflow-hidden bg-brand-night"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      <div className="relative h-[min(78vh,560px)] sm:h-[min(72vh,580px)] lg:h-[min(82vh,660px)]">
        {slides.map((slide, i) => (
          <Slide
            key={`${slide.image}-${i}`}
            slide={slide}
            current={i === index}
            priority={i === 0}
          />
        ))}
      </div>

      {count > 1 && (
        <>
          <CarouselArrow side="left" onClick={() => go(index - 1)} />
          <CarouselArrow side="right" onClick={() => go(index + 1)} />
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "h-px transition-all duration-500",
                  i === index
                    ? "w-12 bg-brand-goldSoft"
                    : "w-6 bg-white/40 hover:bg-white/70"
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function Slide({
  slide,
  current,
  priority,
}: {
  slide: HeroSlide;
  current: boolean;
  priority: boolean;
}) {
  const eyebrow = slide.eyebrow?.trim();
  const title = slide.title?.trim();
  const subtitle = slide.subtitle?.trim();
  const cta = slide.cta?.trim();
  const href = slide.href?.trim();
  const hasCopy = Boolean(eyebrow || title || subtitle || (href && cta));

  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-700",
        current ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      aria-hidden={!current}
    >
      {/* Fills the frame. Anchored to the top rather than the centre: when a
          tall picture is cropped to a wide frame it is the hem that can go, not
          the face. */}
      <Image
        src={slide.image}
        alt={title ?? "Featured collection"}
        fill
        priority={priority}
        sizes="100vw"
        quality={90}
        className="object-cover object-top"
      />

      {hasCopy && (
        <>
          {/* Readability wash — bottom-up on mobile, left-in on desktop. */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-night/95 via-brand-night/50 to-brand-night/10 lg:bg-gradient-to-r lg:from-brand-night/90 lg:via-brand-night/45 lg:to-transparent" />
          <div className="absolute inset-0 flex items-end lg:items-center">
            <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-0">
              {eyebrow && (
                <p className="eyebrow text-brand-goldSoft">{eyebrow}</p>
              )}
              {title && (
                <h2 className="mt-4 max-w-xl font-display text-[2rem] font-normal leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {title}
                </h2>
              )}
              {/* Hairline under the headline — the same ornament the section
                  headings use, so the banner belongs to the same system. */}
              <div className="rule-gold mt-5 w-24" aria-hidden="true" />
              {subtitle && (
                <p className="mt-5 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
                  {subtitle}
                </p>
              )}
              {href && (
                <Link href={href} className="btn btn-ghost mt-7">
                  {cta || "Shop now"}
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CarouselArrow({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous slide" : "Next slide"}
      className={cn(
        "absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-sm border border-white/25 bg-brand-night/25 text-white backdrop-blur transition-colors hover:border-brand-goldSoft/70 hover:bg-brand-night/50 sm:grid",
        side === "left" ? "left-4" : "right-4"
      )}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={side === "left" ? "M15 19.5 7.5 12 15 4.5" : "M9 4.5 16.5 12 9 19.5"}
        />
      </svg>
    </button>
  );
}
