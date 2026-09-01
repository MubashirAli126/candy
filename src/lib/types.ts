// Shared client-side types

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  stock: number;
}

export interface CheckoutForm {
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  notes?: string;
}

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

// Sizes are not fixed in the app: each product carries the sizes the admin
// entered (Product.size) together with each size's own price — parsed by
// parseSizeOptions() in src/lib/sizes.ts.

// ── Product types ─────────────────────────────────────────────────────────────
// What surface a sticker is made for. Stored as a String in Prisma (see
// Product.stickerType) so adding a type never needs a DB migration.
// "OTHER" is the escape hatch: pair it with `customType` free text to sell
// anything that isn't a car / bike / wall sticker — including non-sticker items
// such as engine spray, tyres or polish. The custom label is shown verbatim, so
// nothing is ever mislabelled as a sticker.

export const STICKER_TYPES = ["CAR", "BIKE", "WALL", "OTHER"] as const;

export type StickerType = (typeof STICKER_TYPES)[number];

export const DEFAULT_STICKER_TYPE: StickerType = "OTHER";

export interface StickerTypeOption {
  value: StickerType;
  label: string;
  icon: string;
  /** Category slug this type maps to, used to auto-assign a category. */
  categorySlug: string;
}

export const STICKER_TYPE_OPTIONS: readonly StickerTypeOption[] = [
  { value: "CAR", label: "Car Sticker", icon: "🚗", categorySlug: "car" },
  { value: "BIKE", label: "Bike Sticker", icon: "🏍️", categorySlug: "bike" },
  { value: "WALL", label: "Wall Sticker", icon: "🖼️", categorySlug: "wall" },
  // Not only stickers — accessories and care products live here too.
  { value: "OTHER", label: "Other Items", icon: "✨", categorySlug: "others" },
];

export function isStickerType(value: unknown): value is StickerType {
  return (
    typeof value === "string" && STICKER_TYPES.includes(value as StickerType)
  );
}

/** Normalize any stored/incoming value to a known sticker type. */
export function toStickerType(value: unknown): StickerType {
  return isStickerType(value) ? value : DEFAULT_STICKER_TYPE;
}

export function stickerTypeOption(value: unknown): StickerTypeOption {
  const type = toStickerType(value);
  // Non-null: STICKER_TYPE_OPTIONS covers every STICKER_TYPES member.
  return STICKER_TYPE_OPTIONS.find((o) => o.value === type)!;
}

/**
 * Human label for a product's type. For OTHER the admin's custom text is used
 * exactly as typed — "Engine Spray" stays "Engine Spray", and "Laptop Sticker"
 * stays "Laptop Sticker" — because OTHER also covers non-sticker products.
 */
export function stickerTypeLabel(
  value: unknown,
  customType?: string | null
): string {
  const option = stickerTypeOption(value);
  if (option.value === "OTHER") {
    return customType?.trim() || option.label;
  }
  return option.label;
}

/**
 * Whether the product is one of the fixed sticker types. OTHER may be any kind
 * of product (engine spray, tyre, polish...), so callers must not assume
 * sticker-specific copy for it.
 */
export function isStickerProduct(value: unknown): boolean {
  return toStickerType(value) !== "OTHER";
}

export function stickerTypeIcon(value: unknown): string {
  return stickerTypeOption(value).icon;
}

/**
 * True when a category is just the mirror of a product type — "car" ↔ CAR,
 * "wall" ↔ WALL, etc. Showing both would repeat the same words twice
 * ("Car Sticker" badge next to a "Car Stickers" category), so the UI renders
 * only one of them.
 *
 * Pass `stickerType` to compare against that product's own type; omit it to ask
 * whether the category duplicates any type at all (used by the filter chips).
 */
export function mirrorsStickerType(
  categorySlug: string | null | undefined,
  stickerType?: unknown
): boolean {
  if (!categorySlug) return false;
  const slug = categorySlug.toLowerCase();
  if (stickerType === undefined) {
    return STICKER_TYPE_OPTIONS.some((o) => o.categorySlug === slug);
  }
  return stickerTypeOption(stickerType).categorySlug === slug;
}

/** Best-guess type for a category slug — used to backfill/derive defaults. */
export function stickerTypeFromCategorySlug(
  slug: string | null | undefined
): StickerType {
  if (!slug) return DEFAULT_STICKER_TYPE;
  const match = STICKER_TYPE_OPTIONS.find(
    (o) => o.value !== "OTHER" && slug.toLowerCase().includes(o.categorySlug)
  );
  return match?.value ?? DEFAULT_STICKER_TYPE;
}
