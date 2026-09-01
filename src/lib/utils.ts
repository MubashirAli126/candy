/** Format a number as PKR currency. */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Merge class names, dropping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Turn a string into a URL-safe slug. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Generate a human-friendly order number, e.g. CP-2026-0042. */
export function generateOrderNumber(sequence: number): string {
  const year = new Date().getFullYear();
  return `CP-${year}-${String(sequence).padStart(4, "0")}`;
}

/** Parse the JSON `images` field safely into an array. */
export function parseImages(images: string | null | undefined): string[] {
  if (!images) return [];
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Full ordered gallery for a product: main image first, then the extra images
 * held in the JSON `images` field. Duplicates and blanks are dropped.
 */
export function productGallery(
  image: string,
  images: string | null | undefined
): string[] {
  return Array.from(new Set([image, ...parseImages(images)].filter(Boolean)));
}

/**
 * Inverse of {@link productGallery}: split an ordered gallery into the DB
 * shape — `image` holds the main picture, `images` the JSON-encoded rest.
 * Returns null when the gallery has no usable entry.
 */
export function serializeGallery(
  gallery: string[]
): { image: string; images: string | null } | null {
  const cleaned = Array.from(
    new Set(gallery.map((url) => url.trim()).filter(Boolean))
  );
  if (cleaned.length === 0) return null;

  const [image, ...rest] = cleaned;
  return { image, images: rest.length > 0 ? JSON.stringify(rest) : null };
}

// Sizes and their per-size prices live in src/lib/sizes.ts — see parseSizes()
// and priceForSize() there.

/** Discount percentage between price and salePrice. */
export function discountPercent(price: number, salePrice?: number | null): number {
  if (!salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}
