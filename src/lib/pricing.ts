// Single source of truth for money maths — shared by the product page, the cart,
// checkout and the order API so the shopper is never shown a total the server
// would not agree with.

/** Flat shipping fee in PKR. */
export const SHIPPING = 200;
/** Orders at or above this subtotal ship free. */
export const FREE_SHIPPING_THRESHOLD = 3000;

/** Buying this many units of one line earns the bulk discount. */
export const BULK_MIN_QUANTITY = 50;
/** Percentage off a line that reaches BULK_MIN_QUANTITY. */
export const BULK_DISCOUNT_PERCENT = 10;

/** A cart/order line reduced to what pricing needs: unit price and quantity. */
export interface PricedLine {
  /** Price of a single unit (sale price when the product is on sale). */
  price: number;
  quantity: number;
}

export interface CartTotals {
  /** Unit price × quantity summed over every line, before any bulk discount. */
  itemsTotal: number;
  /** Total bulk discount earned across all lines. */
  discount: number;
  /** itemsTotal − discount. */
  subtotal: number;
  shipping: number;
  total: number;
}

/** Round to whole paisa so floats never leak a long tail into totals. */
function round(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/** Discount percentage a line of this quantity qualifies for (0 when it doesn't). */
export function bulkDiscountPercent(quantity: number): number {
  return quantity >= BULK_MIN_QUANTITY ? BULK_DISCOUNT_PERCENT : 0;
}

/** Line price before discounts: 1 × 100 = 100, 5 × 100 = 500. */
export function lineGross(unitPrice: number, quantity: number): number {
  return round(unitPrice * quantity);
}

/** Bulk discount amount for a single line. */
export function lineDiscount(unitPrice: number, quantity: number): number {
  const gross = lineGross(unitPrice, quantity);
  return round((gross * bulkDiscountPercent(quantity)) / 100);
}

/** What the shopper actually pays for a line, bulk discount applied. */
export function lineTotal(unitPrice: number, quantity: number): number {
  return round(lineGross(unitPrice, quantity) - lineDiscount(unitPrice, quantity));
}

/**
 * Per-unit price after the line's bulk discount — used when a discounted line
 * has to be stored as a unit-price snapshot (see OrderItem.price), so that
 * `price × quantity` still reconciles with the order subtotal.
 */
export function effectiveUnitPrice(unitPrice: number, quantity: number): number {
  if (quantity <= 0) return round(unitPrice);
  return round(lineTotal(unitPrice, quantity) / quantity);
}

/** How many more units a line needs before the bulk discount kicks in. */
export function unitsToBulkDiscount(quantity: number): number {
  return Math.max(0, BULK_MIN_QUANTITY - quantity);
}

/** Shipping fee for a subtotal. An empty cart never gets charged shipping. */
export function shippingFor(subtotal: number): number {
  return subtotal <= 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING;
}

/** Full breakdown for a set of lines, including shipping and grand total. */
export function cartTotals(lines: readonly PricedLine[]): CartTotals {
  let itemsTotal = 0;
  let discount = 0;
  for (const line of lines) {
    itemsTotal += lineGross(line.price, line.quantity);
    discount += lineDiscount(line.price, line.quantity);
  }
  itemsTotal = round(itemsTotal);
  discount = round(discount);
  const subtotal = round(itemsTotal - discount);
  const shipping = shippingFor(subtotal);
  return { itemsTotal, discount, subtotal, shipping, total: round(subtotal + shipping) };
}
