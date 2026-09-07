"use client";

import { useState } from "react";
import MediaUploader from "./MediaUploader";
import {
  COLOR_SUGGESTIONS,
  MAX_COLORS,
  MAX_IMAGES_PER_COLOR,
  colorSwatch,
  type ColorVariant,
} from "@/lib/colors";

/**
 * The colours one design comes in. The suit is uploaded once — name, price,
 * sizes and description are shared — and each colour added here carries its own
 * pictures, so five colours of the same design stay one product.
 *
 * Colour names are free text on purpose: the suggestion list only saves typing,
 * so a shade we never thought of ("Firozi", "Tea Pink") is still sellable and is
 * shown to buyers exactly as typed.
 */
export default function ColorVariantEditor({
  value,
  onChange,
  onUploadingChange,
  onError,
}: {
  value: ColorVariant[];
  onChange: (variants: ColorVariant[]) => void;
  /** Bubbled up so the form can block submit while a picture is uploading. */
  onUploadingChange?: (uploading: boolean) => void;
  onError?: (message: string | null) => void;
}) {
  const [draft, setDraft] = useState("");
  /**
   * Upload state per colour, mirroring `value` by position, so the form can
   * block submit while any colour's picture is still in flight. Tracked by
   * position rather than by name because the name stays editable.
   */
  const [busy, setBusy] = useState<boolean[]>([]);

  const full = value.length >= MAX_COLORS;
  const trimmed = draft.trim();
  const duplicate =
    trimmed.length > 0 &&
    value.some((v) => v.label.toLowerCase() === trimmed.toLowerCase());

  function add() {
    if (!trimmed || duplicate || full) return;
    onChange([...value, { label: trimmed, images: [] }]);
    setBusy((prev) => [...prev, false]);
    setDraft("");
  }

  function update(index: number, patch: Partial<ColorVariant>) {
    onChange(value.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
    // Drop its upload flag with it, else a removed colour whose upload was in
    // flight would keep submit locked forever.
    setBusy((prev) => {
      const next = prev.filter((_, i) => i !== index);
      onUploadingChange?.(next.some(Boolean));
      return next;
    });
  }

  function setUploading(index: number, uploading: boolean) {
    setBusy((prev) => {
      const next = prev.slice();
      next[index] = uploading;
      onUploadingChange?.(next.some(Boolean));
      return next;
    });
  }

  return (
    <div>
      <h3 className="font-display font-bold text-brand-dark">
        Colours of this design
      </h3>
      <p className="mt-1 text-xs text-gray-400">
        Same suit in another colour? Add the colour here with its own pictures —
        don&apos;t upload the design again. Buyers pick a colour and see that
        colour&apos;s photos. Leave this empty if the design comes in one colour
        only.
      </p>

      <div className="mt-3 flex flex-wrap items-start gap-2 sm:flex-nowrap">
        <div className="min-w-[9rem] flex-1">
          <input
            list="color-variant-suggestions"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            // Enter adds the colour instead of submitting the whole product.
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            disabled={full}
            placeholder={
              full ? "Colour list is full" : "Colour name, e.g. Navy Blue"
            }
            aria-label="Colour name"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-brand-purple disabled:bg-gray-50"
          />
          <datalist id="color-variant-suggestions">
            {COLOR_SUGGESTIONS.filter(
              (choice) =>
                !value.some(
                  (v) => v.label.toLowerCase() === choice.toLowerCase(),
                ),
            ).map((choice) => (
              <option key={choice} value={choice} />
            ))}
          </datalist>
        </div>

        <button
          type="button"
          onClick={add}
          disabled={!trimmed || duplicate || full}
          className="shrink-0 rounded-xl border border-brand-purple/30 px-4 py-2.5 text-sm font-semibold text-brand-purple transition-colors hover:bg-brand-purple/10 disabled:opacity-40"
        >
          + Add colour
        </button>
      </div>

      {duplicate && (
        <p className="mt-1.5 text-xs font-semibold text-brand-pink">
          {trimmed} is already in the list.
        </p>
      )}

      {value.length > 0 && (
        <ul className="mt-4 space-y-3">
          {value.map((variant, index) => {
            const swatch = colorSwatch(variant.label);
            return (
              <li
                key={index}
                className="rounded-2xl border border-gray-200 p-3 sm:p-4"
              >
                <div className="flex items-center gap-2">
                  {swatch && (
                    <span
                      aria-hidden
                      className="h-5 w-5 shrink-0 rounded-full border border-black/10"
                      style={{ backgroundColor: swatch }}
                    />
                  )}
                  <input
                    value={variant.label}
                    onChange={(e) => update(index, { label: e.target.value })}
                    aria-label={`Colour ${index + 1} name`}
                    className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-1 py-1 text-sm font-bold text-brand-dark outline-none hover:border-gray-200 focus:border-brand-purple"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label={`Remove ${variant.label}`}
                    className="shrink-0 px-2 py-1 text-gray-400 transition-colors hover:text-brand-pink"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-2">
                  <MediaUploader
                    images={variant.images}
                    onImagesChange={(images) => update(index, { images })}
                    onUploadingChange={(uploading) =>
                      setUploading(index, uploading)
                    }
                    onError={onError}
                    max={MAX_IMAGES_PER_COLOR}
                    label={`${variant.label} pictures`}
                    hint={`Up to ${MAX_IMAGES_PER_COLOR} pictures of this colour. No picture? Buyers see the product's main gallery for this colour.`}
                    allowUrl
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
