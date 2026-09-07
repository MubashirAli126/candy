// Colours a product is available in. Same idea as sizes (src/lib/sizes.ts):
// every colour the admin entered lives in the single free-text column
// `Product.colors`, so offering a new colour never needs a DB migration.
//
//   "Red | Navy Blue | Off White"
//
// Unlike sizes, a colour never changes the price — it is only which shade the
// buyer gets — so a colour is just its label, shown verbatim as typed.

/** Entries are separated by any of these — admins type whichever they know. */
const ENTRY_SEPARATOR = /[,\n|]/;
const ENTRY_SEPARATOR_GLOBAL = /[,\n|]/g;
const ENTRY_JOINER = " | ";

/** Strip the characters that carry meaning in the stored format. */
function sanitizeLabel(label: string): string {
  return label.replace(ENTRY_SEPARATOR_GLOBAL, " ").replace(/\s+/g, " ").trim();
}

/**
 * Colours an admin entered for a product, in the order they were added.
 * Duplicate labels (ignoring case) are dropped, first one wins.
 */
export function parseColors(colors: string | null | undefined): string[] {
  if (!colors) return [];

  const labels: string[] = [];
  const seen = new Set<string>();

  for (const entry of colors.split(ENTRY_SEPARATOR)) {
    const label = entry.trim();
    if (!label) continue;

    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    labels.push(label);
  }

  return labels;
}

/**
 * Inverse of {@link parseColors}: pack the admin's colours back into the one
 * string stored in `Product.colors`. Returns null when no usable colour was
 * given, which is how "this product has no colour options" is stored.
 */
export function serializeColors(labels: readonly string[]): string | null {
  const entries: string[] = [];
  const seen = new Set<string>();

  for (const raw of labels) {
    const label = sanitizeLabel(raw);
    if (!label) continue;

    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    entries.push(label);
  }

  return entries.length > 0 ? entries.join(ENTRY_JOINER) : null;
}

/** How many colours one product may list — keeps the stored string sane. */
export const MAX_COLORS = 20;

/**
 * Suggestions offered in the admin colour box. Only a starting point: the admin
 * can type any colour name, and whatever they type is what buyers see.
 */
export const COLOR_SUGGESTIONS = [
  "Black",
  "White",
  "Off White",
  "Red",
  "Maroon",
  "Pink",
  "Fuchsia",
  "Peach",
  "Orange",
  "Yellow",
  "Mustard",
  "Green",
  "Bottle Green",
  "Teal",
  "Sky Blue",
  "Blue",
  "Navy Blue",
  "Purple",
  "Lilac",
  "Grey",
  "Beige",
  "Brown",
  "Golden",
  "Silver",
] as const;

/** Hex for the colour names we recognise, used to draw a preview swatch. */
const SWATCHES: Record<string, string> = {
  black: "#111111",
  white: "#FFFFFF",
  "off white": "#F5F1E8",
  ivory: "#FFFFF0",
  cream: "#FDF6E3",
  red: "#E1252B",
  maroon: "#7B1E28",
  pink: "#F472B6",
  fuchsia: "#D9268C",
  peach: "#FFCBA4",
  orange: "#F97316",
  yellow: "#FDC10D",
  mustard: "#D4A017",
  green: "#22B24C",
  "bottle green": "#0B6E4F",
  olive: "#6B7C3A",
  teal: "#0F8B8D",
  turquoise: "#40E0D0",
  "sky blue": "#7DD3FC",
  blue: "#2563EB",
  "royal blue": "#1D4ED8",
  "navy blue": "#1E2A5A",
  navy: "#1E2A5A",
  purple: "#7C3AED",
  lilac: "#C8A2E0",
  lavender: "#B79CE0",
  grey: "#9CA3AF",
  gray: "#9CA3AF",
  "charcoal grey": "#3F4247",
  beige: "#E3D5BF",
  brown: "#7A4B2A",
  tan: "#C89F70",
  golden: "#D4AF37",
  gold: "#D4AF37",
  silver: "#C0C4CC",
  copper: "#B87333",
  multicolor: "#B0B0B0",
};

/**
 * A CSS colour for the given label's swatch, or null when we don't recognise
 * the name — callers then fall back to showing the label alone rather than
 * guessing a shade that misleads the buyer.
 */
export function colorSwatch(label: string): string | null {
  return SWATCHES[label.trim().toLowerCase()] ?? null;
}
