"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MediaUploader from "./MediaUploader";
import { DEFAULT_CTA, type AdminSlide } from "@/lib/slides";
import { cn } from "@/lib/utils";

interface Draft {
  eyebrow: string;
  title: string;
  subtitle: string;
  href: string;
  cta: string;
}

const EMPTY_DRAFT: Draft = {
  eyebrow: "",
  title: "",
  subtitle: "",
  href: "",
  cta: "",
};

/** Shortcuts for the most common banner destinations. */
const LINK_PRESETS = [
  { label: "All products", href: "/products" },
  { label: "3 piece suits", href: "/products?type=THREE_PIECE" },
  { label: "2 piece suits", href: "/products?type=TWO_PIECE" },
  { label: "Kurtis", href: "/products?type=KURTI" },
];

/**
 * Add / reorder / hide / remove the homepage slider banners. Copy is optional:
 * a picture on its own is a valid banner, and any field left blank simply
 * isn't drawn on the slide.
 */
export default function SlideManager({
  initialSlides,
}: {
  initialSlides: AdminSlide[];
}) {
  const router = useRouter();
  const [slides, setSlides] = useState(initialSlides);
  const [images, setImages] = useState<string[]>([]);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  /** Run one admin request, surfacing its error and refreshing the storefront. */
  async function send(
    url: string,
    init: RequestInit
  ): Promise<Record<string, unknown> | null> {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(url, init);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Request failed");
      router.refresh();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function addSlide(e: React.FormEvent) {
    e.preventDefault();
    if (images.length === 0) return setError("Please choose a banner picture.");

    const data = await send("/api/admin/slides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: images[0], ...draft }),
    });

    const created = data?.slide as AdminSlide | undefined;
    if (created) {
      setSlides((list) => [...list, created]);
      setImages([]);
      setDraft(EMPTY_DRAFT);
    }
  }

  async function patch(id: string, body: Record<string, unknown>) {
    const data = await send(`/api/admin/slides/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const updated = data?.slide as AdminSlide | undefined;
    if (updated) {
      setSlides((list) => list.map((s) => (s.id === id ? updated : s)));
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this banner from the homepage slider?")) return;
    const ok = await send(`/api/admin/slides/${id}`, { method: "DELETE" });
    if (ok) setSlides((list) => list.filter((s) => s.id !== id));
  }

  /** Swap a banner with its neighbour and re-number the whole list. */
  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;

    const previous = slides;
    const next = [...slides];
    [next[index], next[target]] = [next[target], next[index]];
    // Stored positions can collide after edits, so re-number every row from
    // the new list order rather than trusting the old values.
    const renumbered = next.map((s, i) => ({ ...s, sortOrder: i }));
    setSlides(renumbered);

    setError(null);
    setBusy(true);
    try {
      const results = await Promise.all(
        renumbered.map((s) =>
          fetch(`/api/admin/slides/${s.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sortOrder: s.sortOrder }),
          })
        )
      );
      if (results.some((r) => !r.ok)) throw new Error("reorder failed");
      router.refresh();
    } catch {
      setError("Could not reorder the banners. Please reload and try again.");
      setSlides(previous);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      {error && (
        <p className="border border-brand-logoRed/25 bg-brand-logoRed/[0.04] px-5 py-4 text-sm text-brand-ink">
          {error}
        </p>
      )}

      {/* Add a banner */}
      <form onSubmit={addSlide} className="card space-y-6 p-6 sm:p-8">
        <div>
          <h2 className="eyebrow">Add a banner</h2>
          <div className="rule-hairline mt-3" aria-hidden="true" />
        </div>

        <MediaUploader
          images={images}
          onImagesChange={setImages}
          onUploadingChange={setUploading}
          onError={setError}
          allowUrl
          max={1}
          label="Banner picture"
          hint="Landscape pictures fill the slider best. A portrait shot is shown whole, over a soft blurred background."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Small label (optional)"
            value={draft.eyebrow}
            onChange={(v) => set("eyebrow", v)}
            placeholder="e.g. New Season"
          />
          <Field
            label="Heading (optional)"
            value={draft.title}
            onChange={(v) => set("title", v)}
            placeholder="e.g. Festive Edit"
          />
        </div>

        <Field
          label="One-line description (optional)"
          value={draft.subtitle}
          onChange={(v) => set("subtitle", v)}
          placeholder="e.g. Embroidered lawn suits, stitched and ready."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Field
              label="Button link (optional)"
              value={draft.href}
              onChange={(v) => set("href", v)}
              placeholder="/products?type=KURTI"
            />
            <div className="mt-2.5 flex flex-wrap gap-2">
              {LINK_PRESETS.map((preset) => (
                <button
                  key={preset.href}
                  type="button"
                  onClick={() => set("href", preset.href)}
                  className="border border-brand-ink/15 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-brand-inkSoft transition-colors hover:border-brand-gold hover:text-brand-ink"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          <Field
            label="Button text (optional)"
            value={draft.cta}
            onChange={(v) => set("cta", v)}
            placeholder={DEFAULT_CTA}
          />
        </div>

        <button
          type="submit"
          disabled={busy || uploading || images.length === 0}
          className="btn btn-candy w-full sm:w-auto"
        >
          {busy ? "Saving..." : "Add banner"}
        </button>
      </form>

      {/* Current banners */}
      <div>
        <div className="mb-4">
          <h2 className="eyebrow">
            Slider banners {slides.length > 0 && `(${slides.length})`}
          </h2>
          <div className="rule-hairline mt-3" aria-hidden="true" />
        </div>

        {slides.length === 0 ? (
          <p className="border border-brand-ink/10 bg-brand-cream p-6 text-sm text-brand-inkSoft">
            No banners yet — the homepage is showing the built-in default
            slides. Add one above to take over the slider.
          </p>
        ) : (
          <ul className="space-y-3">
            {slides.map((slide, index) => (
              <li
                key={slide.id}
                className={cn(
                  "card flex flex-col gap-4 p-4 sm:flex-row sm:items-center",
                  !slide.active && "opacity-60"
                )}
              >
                <div className="relative aspect-[16/7] w-full shrink-0 overflow-hidden rounded-sm bg-brand-night sm:aspect-auto sm:h-20 sm:w-36">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.image}
                    alt={slide.title ?? `Banner ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg text-brand-ink">
                    {slide.title || "(no heading)"}
                  </p>
                  <p className="truncate text-xs text-brand-inkMuted">
                    {slide.eyebrow ? `${slide.eyebrow} — ` : ""}
                    {slide.href || "no link"}
                  </p>
                  {!slide.active && (
                    <span className="mt-1.5 inline-block bg-brand-sand px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand-inkMuted">
                      Hidden
                    </span>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <IconButton
                    label={`Move banner ${index + 1} up`}
                    disabled={busy || index === 0}
                    onClick={() => move(index, -1)}
                  >
                    ↑
                  </IconButton>
                  <IconButton
                    label={`Move banner ${index + 1} down`}
                    disabled={busy || index === slides.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    ↓
                  </IconButton>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => patch(slide.id, { active: !slide.active })}
                    className="btn btn-outline btn-sm"
                  >
                    {slide.active ? "Hide" : "Show"}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => remove(slide.id)}
                    className="btn btn-sm border border-brand-logoRed/40 text-brand-logoRed hover:bg-brand-logoRed hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field"
      />
    </div>
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-10 w-10 place-items-center rounded-sm border border-brand-ink/15 text-sm text-brand-ink transition-colors hover:border-brand-gold hover:bg-brand-cream disabled:opacity-30"
    >
      {children}
    </button>
  );
}
