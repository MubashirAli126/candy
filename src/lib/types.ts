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
// What kind of ladies' outfit this is. Stored as a String in Prisma (see
// Product.productType) so adding a type never needs a DB migration.
// "OTHER" is the escape hatch: pair it with `customType` free text to sell
// anything that isn't a 3 piece / 2 piece / kurti — dupattas, trousers, shawls
// and the like. The custom label is shown verbatim, so nothing is ever
// mislabelled as a stitched suit.

export const PRODUCT_TYPES = [
  "THREE_PIECE",
  "TWO_PIECE",
  "KURTI",
  "OTHER",
] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number];

export const DEFAULT_PRODUCT_TYPE: ProductType = "OTHER";

export interface ProductTypeOption {
  value: ProductType;
  label: string;
  /** Compact label for tight spots (filter chips, admin picker buttons). */
  shortLabel: string;
  icon: string;
  /** Category slug this type maps to, used to auto-assign a category. */
  categorySlug: string;
}

export const PRODUCT_TYPE_OPTIONS: readonly ProductTypeOption[] = [
  {
    value: "THREE_PIECE",
    label: "3 Piece Suit",
    shortLabel: "3 Piece",
    icon: "👗",
    categorySlug: "3-piece",
  },
  {
    value: "TWO_PIECE",
    label: "2 Piece Suit",
    shortLabel: "2 Piece",
    icon: "🧵",
    categorySlug: "2-piece",
  },
  {
    value: "KURTI",
    label: "Kurti",
    shortLabel: "Kurti",
    icon: "👚",
    categorySlug: "kurti",
  },
  // Everything the three fixed types don't cover — dupattas, trousers, shawls.
  {
    value: "OTHER",
    label: "Other Items",
    shortLabel: "Other",
    icon: "✨",
    categorySlug: "others",
  },
];

export function isProductType(value: unknown): value is ProductType {
  return (
    typeof value === "string" && PRODUCT_TYPES.includes(value as ProductType)
  );
}

/** Normalize any stored/incoming value to a known product type. */
export function toProductType(value: unknown): ProductType {
  return isProductType(value) ? value : DEFAULT_PRODUCT_TYPE;
}

export function productTypeOption(value: unknown): ProductTypeOption {
  const type = toProductType(value);
  // Non-null: PRODUCT_TYPE_OPTIONS covers every PRODUCT_TYPES member.
  return PRODUCT_TYPE_OPTIONS.find((o) => o.value === type)!;
}

/**
 * Human label for a product's type. For OTHER the admin's custom text is used
 * exactly as typed — "Dupatta" stays "Dupatta" and "Embroidered Shawl" stays
 * "Embroidered Shawl" — because OTHER also covers unstitched pieces.
 */
export function productTypeLabel(
  value: unknown,
  customType?: string | null
): string {
  const option = productTypeOption(value);
  if (option.value === "OTHER") {
    return customType?.trim() || option.label;
  }
  return option.label;
}

/**
 * Whether the product is one of the fixed suit types. OTHER may be any kind of
 * item (dupatta, trouser, shawl...), so callers must not assume suit-specific
 * copy for it.
 */
export function isKnownProductType(value: unknown): boolean {
  return toProductType(value) !== "OTHER";
}

export function productTypeIcon(value: unknown): string {
  return productTypeOption(value).icon;
}

/**
 * True when a category is just the mirror of a product type — "kurti" ↔ KURTI,
 * "3-piece" ↔ THREE_PIECE, etc. Showing both would repeat the same words twice
 * ("Kurti" badge next to a "Kurtis" category), so the UI renders only one of
 * them.
 *
 * Pass `productType` to compare against that product's own type; omit it to ask
 * whether the category duplicates any type at all (used by the filter chips).
 */
export function mirrorsProductType(
  categorySlug: string | null | undefined,
  productType?: unknown
): boolean {
  if (!categorySlug) return false;
  const slug = categorySlug.toLowerCase();
  if (productType === undefined) {
    return PRODUCT_TYPE_OPTIONS.some((o) => o.categorySlug === slug);
  }
  return productTypeOption(productType).categorySlug === slug;
}

/** Best-guess type for a category slug — used to backfill/derive defaults. */
export function productTypeFromCategorySlug(
  slug: string | null | undefined
): ProductType {
  if (!slug) return DEFAULT_PRODUCT_TYPE;
  const match = PRODUCT_TYPE_OPTIONS.find(
    (o) => o.value !== "OTHER" && slug.toLowerCase().includes(o.categorySlug)
  );
  return match?.value ?? DEFAULT_PRODUCT_TYPE;
}
