"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import QuantityStepper from "@/components/QuantityStepper";
import { formatPrice } from "@/lib/utils";
import {
  BULK_DISCOUNT_PERCENT,
  BULK_MIN_QUANTITY,
  bulkDiscountPercent,
  lineDiscount,
  lineGross,
  lineTotal,
  unitsToBulkDiscount,
} from "@/lib/pricing";
import { hasSizePrices, priceForSize, type SizeOption } from "@/lib/sizes";

interface Props {
  product: {
    productId: string;
    slug: string;
    name: string;
    /** Base price — charged for any size the admin didn't price separately. */
    price: number;
    image: string;
    stock: number;
  };
  /** Sizes the admin entered for this product; empty hides the size picker. */
  sizes?: SizeOption[];
}

export default function AddToCartForm({ product, sizes = [] }: Props) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState<string>(sizes[0]?.label ?? "");
  const [added, setAdded] = useState(false);

  const outOfStock = product.stock <= 0;
  const maxQty = Math.max(1, product.stock);

  // The chosen size decides the unit price; the same helper runs on the server
  // when the order is placed, so the shopper is never quoted a different price.
  const unitPrice = priceForSize(product.price, sizes, size);
  const sizePriced = hasSizePrices(sizes);

  const gross = lineGross(unitPrice, qty);
  const discount = lineDiscount(unitPrice, qty);
  const total = lineTotal(unitPrice, qty);
  const discountPct = bulkDiscountPercent(qty);
  const unitsAway = unitsToBulkDiscount(qty);
  // Only tease the bulk deal when the shopper can actually reach it.
  const canReachBulk = maxQty >= BULK_MIN_QUANTITY;

  function handleAdd() {
    if (outOfStock) return;
    addItem({
      ...product,
      price: unitPrice,
      quantity: qty,
      size: size || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-5">
      {/* Size — options come from the admin; nothing is shown when none were set. */}
      {sizes.length > 0 && (
        <div>
          <label className="mb-2 block text-sm font-semibold text-brand-dark">
            Size
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((option) => {
              const selected = size === option.label;
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setSize(option.label)}
                  aria-pressed={selected}
                  className={`rounded-2xl border px-4 py-2 text-left text-sm font-semibold transition-colors ${
                    selected
                      ? "border-brand-purple bg-brand-purple text-white"
                      : "border-gray-200 text-brand-dark hover:border-brand-purple"
                  }`}
                >
                  <span className="block">{option.label}</span>
                  {/* Each size carries its own price — show it on the chip so the
                      choice is never a surprise at checkout. */}
                  {sizePriced && (
                    <span
                      className={`block text-xs font-bold ${
                        selected ? "text-white/90" : "text-brand-purple"
                      }`}
                    >
                      {formatPrice(priceForSize(product.price, sizes, option.label))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-brand-dark">
          Quantity
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <QuantityStepper
            value={qty}
            onChange={setQty}
            max={maxQty}
            label={product.name}
          />
          {!outOfStock && (
            <span className="text-sm text-gray-400">
              {product.stock} in stock
            </span>
          )}
        </div>
        {canReachBulk && unitsAway > 0 && (
          <p className="mt-2 text-sm font-semibold text-brand-purple">
            Add {unitsAway} more ({BULK_MIN_QUANTITY}+) and get{" "}
            {BULK_DISCOUNT_PERCENT}% off.
          </p>
        )}
      </div>

      {/* Live price for the chosen quantity */}
      <dl className="space-y-2 rounded-2xl bg-black/[0.03] p-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-500">
            {formatPrice(unitPrice)} × {qty}
            {size && sizePriced ? ` (${size})` : ""}
          </dt>
          <dd className="font-semibold text-brand-dark">
            {formatPrice(gross)}
          </dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <dt>Bulk discount ({discountPct}%)</dt>
            <dd className="font-semibold">− {formatPrice(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between border-t border-black/5 pt-2">
          <dt className="font-bold text-brand-dark">Total</dt>
          <dd className="font-display text-lg font-extrabold text-brand-dark">
            {formatPrice(total)}
          </dd>
        </div>
      </dl>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          className="flex-1 rounded-full bg-brand-gradient px-6 py-3.5 font-bold text-brand-dark shadow-brand transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {outOfStock ? "Out of stock" : added ? "✓ Added to cart" : "Add to cart"}
        </button>
        <Link
          href="/cart"
          className="rounded-full border border-brand-dark/15 px-6 py-3.5 text-center font-bold text-brand-dark transition-colors hover:bg-black/5"
        >
          Go to cart
        </Link>
      </div>
    </div>
  );
}
