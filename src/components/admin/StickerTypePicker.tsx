"use client";

import { STICKER_TYPE_OPTIONS, type StickerType } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface StickerTypePickerProps {
  value: StickerType;
  onChange: (value: StickerType) => void;
  /** Free text shown only when "Other" is selected. */
  customType: string;
  onCustomTypeChange: (value: string) => void;
  label?: string;
}

/**
 * Product type chooser shared by the quick-add and full product forms.
 * "Other" reveals a free-text field so the store can sell anything that isn't a
 * car / bike / wall sticker — other stickers (laptop, glass, truck art) as well
 * as non-sticker products (engine spray, tyres, polish...).
 */
export default function StickerTypePicker({
  value,
  onChange,
  customType,
  onCustomTypeChange,
  label = "Product type",
}: StickerTypePickerProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-brand-dark">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STICKER_TYPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={cn(
              "rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors",
              value === option.value
                ? "border-brand-purple bg-brand-purple/10 text-brand-purple"
                : "border-gray-200 text-brand-dark hover:border-brand-purple/50"
            )}
          >
            <span aria-hidden="true">{option.icon}</span>{" "}
            {option.value === "OTHER" ? "Other" : option.label.split(" ")[0]}
          </button>
        ))}
      </div>
      {value === "OTHER" && (
        <div className="mt-3">
          <input
            value={customType}
            onChange={(e) => onCustomTypeChange(e.target.value)}
            maxLength={40}
            placeholder="What is it? e.g. Engine Spray, Tyre, Polish, Laptop Sticker"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-brand-purple"
          />
          <p className="mt-1 text-xs text-gray-400">
            Anything that isn&apos;t a car, bike or wall sticker — other
            stickers or non-sticker products like engine spray, tyres and
            polish. Shown to customers exactly as typed.
          </p>
        </div>
      )}
    </div>
  );
}
