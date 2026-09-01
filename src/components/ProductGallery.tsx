"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  /** Ordered images; the first one is shown first. */
  images: string[];
  video?: string | null;
  name: string;
  /** Discount badge percentage; hidden when 0. */
  discount?: number;
}

type Slide = { type: "image" | "video"; url: string };

/**
 * Product media viewer. The big frame is a scroll-snapped track, so the media
 * can be swiped/scrolled directly (not only via the thumbnails), with arrows for
 * pointer users. Tapping a picture opens it full size in a lightbox. Videos are
 * appended after the images and play inline in the same frame.
 */
export default function ProductGallery({
  images,
  video,
  name,
  discount = 0,
}: ProductGalleryProps) {
  const slides = useMemo<Slide[]>(
    () => [
      ...images.map((url): Slide => ({ type: "image", url })),
      ...(video ? [{ type: "video" as const, url: video }] : []),
    ],
    [images, video]
  );

  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  /** Index into `images` currently open full size; null when closed. */
  const [zoomed, setZoomed] = useState<number | null>(null);

  const lastIndex = slides.length - 1;
  const clampIndex = useCallback(
    (index: number) => Math.min(lastIndex, Math.max(0, index)),
    [lastIndex]
  );

  /** Scroll the track to a slide; the scroll handler syncs `active`. */
  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const next = clampIndex(index);
      setActive(next);
      track?.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
    },
    [clampIndex]
  );

  function handleScroll() {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const index = clampIndex(Math.round(track.scrollLeft / track.clientWidth));
    setActive((prev) => (prev === index ? prev : index));
  }

  // Lightbox: lock the page behind it and wire Esc / arrow keys.
  useEffect(() => {
    if (zoomed === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setZoomed(null);
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        setZoomed((current) => {
          if (current === null) return current;
          const step = event.key === "ArrowRight" ? 1 : -1;
          const next = Math.min(images.length - 1, Math.max(0, current + step));
          goTo(next);
          return next;
        });
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [zoomed, images.length, goTo]);

  if (slides.length === 0) return null;

  const current = slides[active] ?? slides[0];

  return (
    <div>
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") goTo(active + 1);
            if (event.key === "ArrowLeft") goTo(active - 1);
          }}
          role="region"
          aria-roledescription="carousel"
          aria-label={`${name} media`}
          tabIndex={0}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-3xl bg-gray-100 shadow-card outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
        >
          {slides.map((slide, index) => (
            <div
              key={`${slide.url}-${index}`}
              aria-label={`${index + 1} of ${slides.length}`}
              className="relative aspect-square w-full shrink-0 snap-center"
            >
              {slide.type === "video" ? (
                <video
                  src={slide.url}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full bg-black object-contain"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setZoomed(index)}
                  aria-label={`Open picture ${index + 1} of ${name} full size`}
                  className="group block h-full w-full cursor-zoom-in"
                >
                  <Image
                    src={slide.url}
                    alt={name}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain"
                  />
                </button>
              )}
            </div>
          ))}
        </div>

        {discount > 0 && (
          <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-brand-pink px-3 py-1.5 text-sm font-bold text-brand-dark shadow">
            -{discount}% OFF
          </span>
        )}

        {slides.length > 1 && (
          <>
            <Arrow
              direction="prev"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
            />
            <Arrow
              direction="next"
              onClick={() => goTo(active + 1)}
              disabled={active === lastIndex}
            />
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white">
              {active + 1} / {slides.length}
            </span>
          </>
        )}

        {current.type === "image" && (
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white">
            🔍 Tap to view full size
          </span>
        )}
      </div>

      {slides.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
          {slides.map((slide, index) => (
            <li key={`thumb-${slide.url}-${index}`}>
              <button
                type="button"
                onClick={() => goTo(index)}
                aria-label={
                  slide.type === "video"
                    ? `Play ${name} video`
                    : `Show picture ${index + 1} of ${name}`
                }
                aria-current={index === active}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden rounded-xl border-2 bg-gray-100 transition-colors",
                  index === active
                    ? "border-brand-purple"
                    : "border-transparent hover:border-brand-purple/40"
                )}
              >
                {slide.type === "video" ? (
                  <span className="grid h-full w-full place-items-center bg-brand-dark text-lg text-white">
                    ▶
                  </span>
                ) : (
                  <Image
                    src={slide.url}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Full-size viewer */}
      {zoomed !== null && images[zoomed] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${name} — full size picture`}
          onClick={() => setZoomed(null)}
          className="fixed inset-0 z-[70] flex cursor-zoom-out items-center justify-center bg-black/90 p-4 motion-safe:animate-[fade-in_0.15s_ease-out]"
        >
          {/* z-10: the picture below fills the overlay, so the controls have to
              sit above it or they never receive the click. */}
          <button
            type="button"
            onClick={() => setZoomed(null)}
            aria-label="Close full size picture"
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20"
          >
            ✕
          </button>

          {/* Clicking the picture closes the viewer too (the overlay handles it). */}
          <div className="relative h-full w-full">
            <Image
              src={images[zoomed]}
              alt={name}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {images.length > 1 && (
            <>
              <ZoomNav
                direction="prev"
                disabled={zoomed === 0}
                onClick={() => {
                  const next = Math.max(0, zoomed - 1);
                  setZoomed(next);
                  goTo(next);
                }}
              />
              <ZoomNav
                direction="next"
                disabled={zoomed === images.length - 1}
                onClick={() => {
                  const next = Math.min(images.length - 1, zoomed + 1);
                  setZoomed(next);
                  goTo(next);
                }}
              />
              <span className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                {zoomed + 1} / {images.length}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Arrow({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous media" : "Next media"}
      className={cn(
        "absolute top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-lg font-bold text-brand-dark shadow transition hover:bg-white disabled:pointer-events-none disabled:opacity-0",
        direction === "prev" ? "left-3" : "right-3"
      )}
    >
      {direction === "prev" ? "‹" : "›"}
    </button>
  );
}

function ZoomNav({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous picture" : "Next picture"}
      className={cn(
        "absolute top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/10 text-3xl text-white transition-colors hover:bg-white/20 disabled:pointer-events-none disabled:opacity-20",
        direction === "prev" ? "left-3 sm:left-6" : "right-3 sm:right-6"
      )}
    >
      {direction === "prev" ? "‹" : "›"}
    </button>
  );
}
