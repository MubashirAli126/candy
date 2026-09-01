// Sizes and their prices — one size can cost more than another, e.g. a
// "Medium" kurti at Rs 2500 and the same design in "XL" for Rs 2900.
//
// Both live in the single free-text column `Product.size`, so selling a new size
// never needs a DB migration. Each entry is `label=price`, entries separated by
// "|", "," or a newline:
//
//   "Small=2500 | Medium=2700 | Large=2900"
//
// The price part is optional: older products that only list sizes
// ("Small, Medium, Large") keep working and those sizes simply cost the
// product's base price. An entered size price is what the buyer pays verbatim —
// it replaces price/salePrice for that size, so the admin's number is never
// silently adjusted.

/** One size an admin offers for a product, with its own price. */
export interface SizeOption {
  /** Shown to buyers exactly as typed, e.g. "Medium" or "38". */
  label: string;
  /** Price for this size in PKR; null means "use the product's base price". */
  price: number | null;
}

/** Entries are separated by any of these — admins type whichever they know. */
const ENTRY_SEPARATOR = /[,\n|]/;
const ENTRY_SEPARATOR_GLOBAL = /[,\n|]/g;
/** Everything after the first "=" in an entry is that size's price. */
const PRICE_SEPARATOR = "=";
const ENTRY_JOINER = " | ";

/** Read a price as typed — "250", "Rs 250" and "250.00" all mean 250. */
function parsePrice(raw: string | undefined): number | null {
  if (!raw) return null;
  const amount = Number(raw.replace(/[^\d.]/g, ""));
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

/** Strip the characters that carry meaning in the stored format. */
function sanitizeLabel(label: string): string {
  return label
    .replace(ENTRY_SEPARATOR_GLOBAL, " ")
    .split(PRICE_SEPARATOR)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Size options an admin entered for a product. Whatever they typed is shown
 * verbatim; the storefront never invents a size or a price. Duplicate labels
 * (ignoring case) are dropped, first one wins.
 */
export function parseSizeOptions(
  size: string | null | undefined
): SizeOption[] {
  if (!size) return [];

  const options: SizeOption[] = [];
  const seen = new Set<string>();

  for (const entry of size.split(ENTRY_SEPARATOR)) {
    const separatorAt = entry.indexOf(PRICE_SEPARATOR);
    const label = (
      separatorAt === -1 ? entry : entry.slice(0, separatorAt)
    ).trim();
    if (!label) continue;

    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    options.push({
      label,
      price: separatorAt === -1 ? null : parsePrice(entry.slice(separatorAt + 1)),
    });
  }

  return options;
}

/**
 * Inverse of {@link parseSizeOptions}: pack the admin's rows back into the one
 * string stored in `Product.size`. Returns null when no usable size was given,
 * which is how "this product has no size picker" is stored.
 */
export function serializeSizeOptions(
  options: readonly SizeOption[]
): string | null {
  const entries: string[] = [];
  const seen = new Set<string>();

  for (const option of options) {
    const label = sanitizeLabel(option.label);
    if (!label) continue;

    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const price =
      option.price !== null && Number.isFinite(option.price) && option.price > 0
        ? Math.round(option.price * 100) / 100
        : null;
    entries.push(price === null ? label : `${label}${PRICE_SEPARATOR}${price}`);
  }

  return entries.length > 0 ? entries.join(ENTRY_JOINER) : null;
}

/** Just the size labels — for copy such as "Available sizes: ...". */
export function parseSizes(size: string | null | undefined): string[] {
  return parseSizeOptions(size).map((o) => o.label);
}

/** True when at least one size carries its own price. */
export function hasSizePrices(options: readonly SizeOption[]): boolean {
  return options.some((o) => o.price !== null);
}

/** The option matching a label, comparing case-insensitively. */
export function findSizeOption(
  options: readonly SizeOption[],
  label: string | null | undefined
): SizeOption | undefined {
  if (!label) return undefined;
  const key = label.trim().toLowerCase();
  return options.find((o) => o.label.toLowerCase() === key);
}

/**
 * Unit price for the chosen size: the size's own price when the admin set one,
 * otherwise the product's base price. Used by the product page, the cart and
 * the order API alike, so the shopper and the server always agree.
 */
export function priceForSize(
  basePrice: number,
  options: readonly SizeOption[],
  label: string | null | undefined
): number {
  return findSizeOption(options, label)?.price ?? basePrice;
}

/** Cheapest / dearest a product can be across its sizes. */
export function sizePriceRange(
  basePrice: number,
  options: readonly SizeOption[]
): { min: number; max: number } {
  const prices = options.map((o) => o.price ?? basePrice);
  if (prices.length === 0) return { min: basePrice, max: basePrice };
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/**
 * The sizes an admin can offer. Fixed on purpose so every product uses the same
 * wording; older products storing anything else still parse and display fine.
 */
export const SIZE_CHOICES = ["Small", "Medium", "Large"] as const;
