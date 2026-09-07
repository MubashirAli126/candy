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
 * Banner artwork is often a portrait product shot, which a full-bleed
 * `object-cover` would blow up past its native size (visibly soft/pixelated) or
 * crop to a sliver. So each slide shows the picture *contained* — never
 * upscaled beyond its frame — over a blurred, scaled copy of itself that fills
 * the remaining width. Wide banner artwork still fills the frame edge to edge.
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
      <div className="relative h-[320px] sm:h-[420px] lg:h-[520px]">
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
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index ? "w-6 bg-brand-pink" : "w-2 bg-white/50 hover:bg-white/80"
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
      {/* Blurred backdrop: fills the frame so a portrait picture never has to
          stretch, and never shows a hard letterbox edge. */}
      <Image
        src={slide.image}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        quality={35}
        className="scale-110 object-cover blur-2xl"
      />
      <div className="absolute inset-0 bg-brand-night/45" />

      {/* The picture itself, at its own aspect ratio. Pushed right on desktop
          so the copy on the left never covers the outfit. */}
      <Image
        src={slide.image}
        alt={title ?? "Featured collection"}
        fill
        priority={priority}
        sizes="100vw"
        quality={90}
        className="object-contain object-top lg:object-right-top"
      />

      {hasCopy && (
        <>
          {/* Readability wash — bottom-up on mobile, left-in on desktop. */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-night/90 via-brand-night/45 to-transparent lg:bg-gradient-to-r lg:from-brand-night/90 lg:via-brand-night/50 lg:to-transparent" />
          <div className="absolute inset-0 flex items-end lg:items-center">
            <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-0">
              {eyebrow && (
                <span className="inline-block rounded-full bg-brand-gradient px-4 py-1 text-xs font-bold uppercase tracking-[0.14em] text-brand-dark">
                  {eyebrow}
                </span>
              )}
              {title && (
                <h2 className="mt-3 max-w-xl font-display text-3xl font-extrabold leading-tight text-white sm:text-5xl">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-3 max-w-md text-sm text-white/80 sm:text-base">
                  {subtitle}
                </p>
              )}
              {href && (
                <Link
                  href={href}
                  className="mt-6 inline-block rounded-full bg-brand-gradient px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-brand-dark shadow-brand transition-transform hover:scale-105"
                >
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
        "absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur transition-colors hover:bg-black/45 sm:grid",
        side === "left" ? "left-4" : "right-4"
      )}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
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
