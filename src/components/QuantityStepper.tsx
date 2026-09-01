"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  /** Compact variant for dense lists such as the cart. */
  size?: "sm" | "md";
  /** Accessible name, e.g. the product name. */
  label?: string;
}

/**
 * Quantity control with −/+ buttons and a typable field, so reaching bulk
 * quantities (50+) doesn't mean clicking "+" fifty times. Used by the product
 * page and the cart.
 */
export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  label,
}: QuantityStepperProps) {
  // Local text state lets the field be empty mid-typing without snapping back.
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  function commit(raw: string) {
    const parsed = Number.parseInt(raw, 10);
    const next = Number.isFinite(parsed) ? clamp(parsed) : min;
    setDraft(String(next));
    if (next !== value) onChange(next);
  }

  const button = size === "sm" ? "h-8 w-8 text-base" : "h-10 w-10 text-lg";
  const field = size === "sm" ? "h-8 w-12 text-sm" : "h-10 w-16 text-base";

  return (
    <div className="inline-flex items-center rounded-full border border-gray-200">
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label={label ? `Decrease quantity of ${label}` : "Decrease quantity"}
        className={cn(
          "grid place-items-center font-bold text-brand-dark disabled:opacity-30",
          button
        )}
      >
        −
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={draft}
        onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ""))}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit(draft);
          }
        }}
        aria-label={label ? `Quantity of ${label}` : "Quantity"}
        className={cn(
          "border-x border-gray-200 bg-transparent text-center font-bold text-brand-dark outline-none focus:bg-brand-purple/5",
          field
        )}
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label={label ? `Increase quantity of ${label}` : "Increase quantity"}
        className={cn(
          "grid place-items-center font-bold text-brand-dark disabled:opacity-30",
          button
        )}
      >
        +
      </button>
    </div>
  );
}
