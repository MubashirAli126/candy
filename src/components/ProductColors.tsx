import { colorSwatch } from "@/lib/colors";

/**
 * Colours a product is available in, as entered by the admin. Names are shown
 * verbatim; a swatch is drawn only for shades we recognise, so an unfamiliar
 * name is never paired with a misleading colour.
 */
export default function ProductColors({ colors }: { colors: string[] }) {
  if (colors.length === 0) return null;

  return (
    <div className="mt-5">
      <p className="mb-2 text-sm font-semibold text-brand-dark">
        Available colours
      </p>
      <ul className="flex flex-wrap gap-2">
        {colors.map((color) => {
          const swatch = colorSwatch(color);
          return (
            <li
              key={color}
              className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-semibold text-brand-dark"
            >
              {swatch && (
                <span
                  aria-hidden
                  className="h-4 w-4 shrink-0 rounded-full border border-black/10"
                  style={{ backgroundColor: swatch }}
                />
              )}
              {color}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
