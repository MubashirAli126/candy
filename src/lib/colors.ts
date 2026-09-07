// Colour variants: one product, one design, several colours.
//
// A suit is uploaded once — the design, description, sizes and price are shared
// — and each colour it comes in carries its own pictures. The buyer picks a
// colour and the gallery switches to that colour's photos, so five colours of
// the same design are one product, not five.
//
// All of it lives in the single free-text column `Product.colors` as a JSON
// array, the same trick `Product.images` already uses, so adding a colour never
// needs a migration:
//
//   [{"label":"Red","images":["/uploads/red-1.jpg"]}, ...]

/** One colour a product's design is available in. */
export interface ColorVariant {
  /** Shown to buyers exactly as typed, e.g. "Navy Blue" or "Firozi". */
  label: string;
  /** This colour's own pictures; the first one represents the colour. */
  images: string[];
}

/** Colours one product may list. */
export const MAX_COLORS = 12;
/** Pictures per colour — the shared gallery carries the rest of the design. */
export const MAX_IMAGES_PER_COLOR = 4;
/**
 * Cap for the stored JSON string. Generous enough for MAX_COLORS colours with
 * MAX_IMAGES_PER_COLOR long picture URLs each, so a legitimate payload is never
 * rejected, while still bounding what a request can write.
 */
export const MAX_COLORS_LENGTH = 8000;

/** Entries in the pre-JSON format, which stored colour names only. */
const LEGACY_SEPARATOR = /[,\n|]/;

function sanitizeLabel(label: string): string {
  return label.replace(/\s+/g, " ").trim();
}

/**
 * Drop blanks, trim, and collapse duplicate labels (ignoring case, first one
 * wins) — applied on both read and write so a product never shows the same
 * colour twice however the data got in.
 */
function normalize(variants: readonly ColorVariant[]): ColorVariant[] {
  const out: ColorVariant[] = [];
  const seen = new Set<string>();

  for (const variant of variants) {
    const label = sanitizeLabel(variant.label ?? "");
    if (!label) continue;

    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const images = (Array.isArray(variant.images) ? variant.images : [])
      .filter((url): url is string => typeof url === "string" && url.length > 0)
      .slice(0, MAX_IMAGES_PER_COLOR);

    out.push({ label, images });
    if (out.length >= MAX_COLORS) break;
  }

  return out;
}

/**
 * Colour variants an admin entered for a product. Anything unreadable parses to
 * "no colours" rather than throwing, so one bad row can never take a product
 * page down.
 *
 * Also reads the older name-only format ("Red | Navy Blue") that predates
 * per-colour pictures — those colours simply have no pictures of their own and
 * fall back to the product's shared gallery.
 */
export function parseColorVariants(
  colors: string | null | undefined,
): ColorVariant[] {
  if (!colors) return [];

  const trimmed = colors.trim();
  // Anything that means to be JSON is read only as JSON: falling back to the
  // name parser would turn a truncated row into a colour called "{oops".
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      const parsed: unknown = JSON.parse(trimmed);
      if (!Array.isArray(parsed)) return [];
      return normalize(
        parsed
          .filter(
            (v): v is { label?: unknown; images?: unknown } =>
              typeof v === "object" && v !== null,
          )
          .map((v) => ({
            label: typeof v.label === "string" ? v.label : "",
            images: Array.isArray(v.images) ? (v.images as string[]) : [],
          })),
      );
    } catch {
      return [];
    }
  }

  return normalize(
    trimmed.split(LEGACY_SEPARATOR).map((label) => ({ label, images: [] })),
  );
}

/**
 * Inverse of {@link parseColorVariants}: pack the admin's colours into the one
 * string stored in `Product.colors`. Returns null when no usable colour was
 * given, which is how "this product has no colour options" is stored.
 */
export function serializeColorVariants(
  variants: readonly ColorVariant[],
): string | null {
  const normalized = normalize(variants);
  return normalized.length > 0 ? JSON.stringify(normalized) : null;
}

/** The variant matching a label, comparing case-insensitively. */
export function findColorVariant(
  variants: readonly ColorVariant[],
  label: string | null | undefined,
): ColorVariant | undefined {
  if (!label) return undefined;
  const key = label.trim().toLowerCase();
  return variants.find((v) => v.label.toLowerCase() === key);
}

/**
 * Pictures to show for the chosen colour: that colour's own photos when the
 * admin uploaded any, otherwise the product's shared gallery. Never returns an
 * empty gallery as long as the product itself has one picture.
 */
export function galleryForColor(
  variants: readonly ColorVariant[],
  label: string | null | undefined,
  productImages: readonly string[],
): string[] {
  const images = findColorVariant(variants, label)?.images ?? [];
  return images.length > 0 ? [...images] : [...productImages];
}

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
 * the name — callers then fall back to the colour's own photo or the label
 * alone rather than guessing a shade that misleads the buyer.
 */
export function colorSwatch(label: string): string | null {
  return SWATCHES[label.trim().toLowerCase()] ?? null;
}
