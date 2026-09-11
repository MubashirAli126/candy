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
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <div className="text-5xl" aria-hidden="true">🛍️</div>
        <h1 className="mt-6 font-display text-3xl font-normal tracking-tight text-brand-ink sm:text-4xl">
          Your cart is empty
        </h1>
        <div className="rule-gold mx-auto mt-5 w-20" aria-hidden="true" />
        <p className="mt-5 text-sm text-brand-inkSoft sm:text-base">
          Nothing picked out yet — the new season is waiting.
        </p>
        <Link href="/products" className="btn btn-primary mt-6">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <header className="mb-6 border-b border-brand-ink/10 pb-6 sm:mb-9">
        <p className="eyebrow">Shopping bag</p>
        <h1 className="mt-3 font-display text-3xl font-normal tracking-tight text-brand-ink sm:text-4xl">
          Your Cart{" "}
          <span className="text-brand-inkMuted">({totalItems})</span>
        </h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-6">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size ?? ""}-${item.color ?? ""}`}
              className="flex gap-4 border border-brand-ink/10 bg-white p-3 sm:p-4"
            >
              <Link
                href={`/products/${item.slug}`}
                className="relative h-24 w-[4.5rem] shrink-0 overflow-hidden bg-brand-cream sm:h-32 sm:w-24"
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
                    className="font-display text-base leading-snug text-brand-ink transition-colors hover:text-brand-plum sm:text-lg"
                  >
                    {item.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      removeItem({
                        productId: item.productId,
                        size: item.size,
                        color: item.color,
                      })
                    }
                    className="shrink-0 text-brand-inkMuted transition-colors hover:text-brand-pink"
                    aria-label="Remove item"
                  >
                    ✕
                  </button>
                </div>
                {(item.size || item.colorLabel) && (
                  <span className="mt-1 text-xs uppercase tracking-[0.12em] text-brand-inkSoft">
                    {[
                      item.colorLabel ?? null,
                      item.size ? `Size: ${item.size}` : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                )}
                <span className="mt-0.5 text-xs text-brand-inkMuted">
                  {formatPrice(item.price)} / piece
                </span>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                  <QuantityStepper
                    value={item.quantity}
                    onChange={(quantity) =>
                      setQuantity(
                        {
                          productId: item.productId,
                          size: item.size,
                          color: item.color,
                        },
                        quantity,
                      )
                    }
                    max={item.stock || 99}
                    size="sm"
                    label={item.name}
                  />
                  <span className="text-right">
                    {bulkDiscountPercent(item.quantity) > 0 && (
                      <span className="block text-xs text-brand-inkMuted line-through">
                        {formatPrice(lineGross(item.price, item.quantity))}
                      </span>
                    )}
                    <span className="font-medium text-brand-ink">
                      {formatPrice(lineTotal(item.price, item.quantity))}
                    </span>
                  </span>
                </div>
                {bulkDiscountPercent(item.quantity) > 0 && (
                  <span className="mt-2 self-start border border-brand-gold/40 bg-brand-cream px-2 py-0.5 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-brand-plum">
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
          <div className="border border-brand-ink/10 bg-brand-cream p-5 sm:p-6 lg:sticky lg:top-28">
            <h2 className="font-display text-xl text-brand-ink">Order Summary</h2>
            <div className="rule-gold mt-3 w-14" aria-hidden="true" />
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-brand-inkSoft">Items ({totalItems})</dt>
                <dd className="font-semibold">{formatPrice(itemsTotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-brand-plum">
                  <dt>Bulk discount ({BULK_DISCOUNT_PERCENT}%)</dt>
                  <dd className="font-semibold">− {formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-brand-inkSoft">Subtotal</dt>
                <dd className="font-semibold">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-brand-inkSoft">Shipping</dt>
                <dd className="font-semibold">
                  {shipping === 0 ? (
                    <span className="uppercase tracking-[0.12em] text-brand-plum">Free</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </dd>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-brand-inkSoft">
                  Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for
                  free shipping!
                </p>
              )}
              <div className="flex items-baseline justify-between border-t border-brand-ink/10 pt-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-ink">
                  Total
                </dt>
                <dd className="font-display text-xl text-brand-ink">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>
            <Link
              href="/checkout"
              className="btn btn-candy mt-6 w-full"
            >
              Proceed to checkout
            </Link>
            <Link
              href="/products"
              className="mt-4 block text-center text-xs font-semibold uppercase tracking-[0.14em] text-brand-inkSoft transition-colors hover:text-brand-ink"
            >
              ← Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
