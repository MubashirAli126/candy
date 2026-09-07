"use client";

import { useId, useState } from "react";
import {
  COLOR_SUGGESTIONS,
  MAX_COLORS,
  colorSwatch,
} from "@/lib/colors";

/**
 * The colours a product is available in. An admin adds as many as they like —
 * type or pick a name, press Add (or Enter), and it joins the list as a chip.
 *
 * Colour names are free text on purpose: the suggestion list only saves typing,
 * so a shade we never thought of ("Firozi", "Tea Pink") is still sellable and is
 * shown to buyers exactly as typed.
 */
export default function ColorEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (colors: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const listId = useId();

  const full = value.length >= MAX_COLORS;
  const trimmed = draft.trim();
  const duplicate =
    trimmed.length > 0 &&
    value.some((c) => c.toLowerCase() === trimmed.toLowerCase());

  function add() {
    if (!trimmed || duplicate || full) return;
    onChange([...value, trimmed]);
    setDraft("");
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label
        htmlFor={`${listId}-input`}
        className="mb-1.5 block text-sm font-semibold text-brand-dark"
      >
        Colours
      </label>

      <div className="flex flex-wrap items-start gap-2 sm:flex-nowrap">
        <div className="min-w-[9rem] flex-1">
          <input
            id={`${listId}-input`}
            list={listId}
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
            placeholder={full ? "Colour list is full" : "e.g. Navy Blue"}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-brand-purple disabled:bg-gray-50"
          />
          <datalist id={listId}>
            {COLOR_SUGGESTIONS.filter(
              (choice) =>
                !value.some((c) => c.toLowerCase() === choice.toLowerCase())
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
        <ul className="mt-3 flex flex-wrap gap-2">
          {value.map((color, index) => {
            const swatch = colorSwatch(color);
            return (
              <li
                key={color}
                className="flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-2 pr-1 text-sm font-semibold text-brand-dark"
              >
                {swatch && (
                  <span
                    aria-hidden
                    className="h-4 w-4 shrink-0 rounded-full border border-black/10"
                    style={{ backgroundColor: swatch }}
                  />
                )}
                {color}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label={`Remove ${color}`}
                  className="px-1.5 text-gray-400 transition-colors hover:text-brand-pink"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-2 text-xs text-gray-400">
        Add every colour this design comes in — buyers see them on the product
        page. Leave it empty if the product has just one colour.
      </p>
    </div>
  );
}
