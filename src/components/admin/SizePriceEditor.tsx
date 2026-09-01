"use client";

import { formatPrice } from "@/lib/utils";
import { SIZE_CHOICES, type SizeOption } from "@/lib/sizes";

/**
 * Sizes an admin sells a product in, each with its own price. The size itself
 * is picked from the fixed Small / Medium / Large list, so every product uses
 * the same wording and buyers see a consistent size picker.
 *
 * The price box for a row only appears once that row has a size, because a price
 * with no size to attach it to means nothing.
 */
export default function SizePriceEditor({
  value,
  onChange,
  basePrice,
}: {
  value: SizeOption[];
  onChange: (options: SizeOption[]) => void;
  /** Product price, used for the "left empty → this is charged" hint. */
  basePrice?: number;
}) {
  // Always offer one empty row so the admin can pick straight away.
  const rows = value.length > 0 ? value : [{ label: "", price: null }];

  /** Sizes already taken by another row — each size can only be listed once. */
  function takenByOthers(index: number): Set<string> {
    return new Set(
      rows
        .filter((_, i) => i !== index)
        .map((row) => row.label.trim().toLowerCase())
        .filter(Boolean)
    );
  }

  const allTaken = takenByOthers(-1).size >= SIZE_CHOICES.length;

  function update(index: number, patch: Partial<SizeOption>) {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function addRow() {
    onChange([...rows, { label: "", price: null }]);
  }

  function removeRow(index: number) {
    onChange(rows.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-brand-dark">
        Sizes & price per size
      </label>

      <div className="space-y-2">
        {rows.map((row, index) => {
          const hasLabel = row.label.trim().length > 0;
          const taken = takenByOthers(index);
          return (
            <div key={index} className="flex flex-wrap items-start gap-2 sm:flex-nowrap">
              <div className="min-w-[9rem] flex-1">
                <select
                  value={row.label}
                  onChange={(e) => update(index, { label: e.target.value })}
                  aria-label={`Size ${index + 1}`}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 outline-none focus:border-brand-purple"
                >
                  <option value="">Choose size</option>
                  {SIZE_CHOICES.map((choice) => (
                    <option
                      key={choice}
                      value={choice}
                      disabled={taken.has(choice.toLowerCase())}
                    >
                      {choice}
                    </option>
                  ))}
                  {/* Keep an older, non-standard size selectable so editing a
                      product never silently drops it. */}
                  {hasLabel &&
                    !SIZE_CHOICES.some(
                      (c) => c.toLowerCase() === row.label.trim().toLowerCase()
                    ) && <option value={row.label}>{row.label}</option>}
                </select>
              </div>

              {/* Price appears only after a size has been chosen. */}
              <div className="w-[7.5rem] shrink-0 sm:w-32">
                {hasLabel ? (
                  <input
                    type="number"
                    min={0}
                    step="1"
                    value={row.price ?? ""}
                    onChange={(e) =>
                      update(index, {
                        price: e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                    placeholder="Price"
                    aria-label={`Price for ${row.label.trim()}`}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-brand-purple"
                  />
                ) : (
                  <p className="px-1 py-2.5 text-xs text-gray-300">
                    Price appears here
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeRow(index)}
                disabled={rows.length === 1 && !hasLabel}
                aria-label={`Remove size ${index + 1}`}
                className="mt-1 px-2 py-1.5 text-gray-400 transition-colors hover:text-brand-pink disabled:opacity-30"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addRow}
        disabled={allTaken || rows.length >= SIZE_CHOICES.length}
        className="mt-2 rounded-full border border-brand-purple/30 px-4 py-1.5 text-sm font-semibold text-brand-purple transition-colors hover:bg-brand-purple/10 disabled:opacity-40"
      >
        + Add another size
      </button>

      <p className="mt-2 text-xs text-gray-400">
        Buyers pick one of these sizes and pay that size&apos;s price. Leave a
        price empty to charge the product price
        {basePrice && basePrice > 0 ? ` (${formatPrice(basePrice)})` : ""}. No
        sizes at all hides the size picker.
      </p>
    </div>
  );
}
