"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import QuantityStepper from "@/components/QuantityStepper";
import { formatPrice } from "@/lib/utils";
import {
  BULK_DISCOUNT_PERCENT,
  BULK_MIN_QUANTITY,
  FREE_SHIPPING_THRESHOLD,
  bulkDiscountPercent,
  lineGross,
  lineTotal,
} from "@/lib/pricing";

export default function CartPage() {
  const {
    items,
    setQuantity,
    removeItem,
    itemsTotal,
    discount,
    subtotal,
    shipping,
    total,
    totalItems,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <div className="text-6xl">🛒</div>
        <h1 className="mt-4 font-display text-3xl font-extrabold text-brand-dark">
          Your cart is empty
        </h1>
        <p className="mt-2 text-gray-500">
          Looks like you haven't added anything yet.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-brand-gradient px-7 py-3.5 font-bold text-brand-dark shadow-brand"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <h1 className="mb-6 font-display text-2xl font-extrabold text-brand-dark sm:mb-8 sm:text-4xl">
        Your Cart ({totalItems})
      </h1>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size ?? ""}`}
              className="flex gap-3 rounded-2xl border border-black/5 bg-white p-3 shadow-card sm:gap-4 sm:p-4"
            >
              <Link
                href={`/products/${item.slug}`}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-24 sm:w-24"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 80px, 96px"
                  className="object-cover"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-semibold text-brand-dark hover:text-brand-pink"
                  >
                    {item.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId, item.size)}
                    className="text-gray-400 hover:text-brand-pink"
                    aria-label="Remove item"
                  >
                    ✕
                  </button>
                </div>
                {item.size && (
                  <span className="text-sm text-gray-500">Size: {item.size}</span>
                )}
                <span className="text-xs text-gray-400">
                  {formatPrice(item.price)} / piece
                </span>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                  <QuantityStepper
                    value={item.quantity}
                    onChange={(quantity) =>
                      setQuantity(item.productId, quantity, item.size)
                    }
                    max={item.stock || 99}
                    size="sm"
                    label={item.name}
                  />
                  <span className="text-right">
                    {bulkDiscountPercent(item.quantity) > 0 && (
                      <span className="block text-xs text-gray-400 line-through">
                        {formatPrice(lineGross(item.price, item.quantity))}
                      </span>
                    )}
                    <span className="font-bold text-brand-dark">
                      {formatPrice(lineTotal(item.price, item.quantity))}
                    </span>
                  </span>
                </div>
                {bulkDiscountPercent(item.quantity) > 0 && (
                  <span className="mt-1 self-start rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                    {BULK_MIN_QUANTITY}+ bulk discount −
                    {bulkDiscountPercent(item.quantity)}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-card sm:p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-xl font-bold text-brand-dark">
              Order Summary
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Items ({totalItems})</dt>
                <dd className="font-semibold">{formatPrice(itemsTotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <dt>Bulk discount ({BULK_DISCOUNT_PERCENT}%)</dt>
                  <dd className="font-semibold">− {formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-500">Subtotal</dt>
                <dd className="font-semibold">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Shipping</dt>
                <dd className="font-semibold">
                  {shipping === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </dd>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-brand-purple">
                  Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for
                  free shipping!
                </p>
              )}
              <div className="flex justify-between border-t border-black/5 pt-3 text-base">
                <dt className="font-bold text-brand-dark">Total</dt>
                <dd className="font-extrabold text-brand-dark">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>
            <Link
              href="/checkout"
              className="mt-6 block rounded-full bg-brand-gradient px-6 py-3.5 text-center font-bold text-brand-dark shadow-brand transition-transform hover:scale-[1.02]"
            >
              Proceed to checkout
            </Link>
            <Link
              href="/products"
              className="mt-3 block text-center text-sm font-semibold text-brand-purple hover:underline"
            >
              ← Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
