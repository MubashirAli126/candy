"use client";

import { formatPrice } from "@/lib/utils";
import type { SizeOption } from "@/lib/sizes";

/**
 * Sizes an admin sells a product in, each with its own price. Sizes are real
 * measurements typed by the admin ("10x10 cm", "12x20 cm") — never a fixed
 * Small/Medium/Large list — so any new size works without a code change.
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
  // Always offer one empty row so the admin can type straight away.
  const rows = value.length > 0 ? value : [{ label: "", price: null }];

  function update(index: number, patch: Partial<SizeOption>) {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function addRow() {
    onChange([...rows, { label: "", price: null }]);
  }

  function removeRow(index: number) {
    const next = rows.filter((_, i) => i !== index);
    onChange(next);
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-brand-dark">
        Sizes & price per size
      </label>

      <div className="space-y-2">
        {rows.map((row, index) => {
          const hasLabel = row.label.trim().length > 0;
          return (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-1">
                <input
                  value={row.label}
                  onChange={(e) => update(index, { label: e.target.value })}
                  placeholder="Size e.g. 10x10 cm"
                  aria-label={`Size ${index + 1}`}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-brand-purple"
                />
              </div>

              {/* Price appears only after a size has been entered. */}
              <div className="w-32 shrink-0">
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
        className="mt-2 rounded-full border border-brand-purple/30 px-4 py-1.5 text-sm font-semibold text-brand-purple transition-colors hover:bg-brand-purple/10"
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
