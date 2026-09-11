"use client";

import { useState } from "react";
import Image from "next/image";
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
import { useProductColor } from "@/context/ProductColorContext";

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

/** One colour to choose, shown as the picture of the suit in that colour. */
function ColorChoice({
  image,
  label,
  selected,
  onSelect,
}: {
  image: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={label}
      title={label}
      className={`relative h-16 w-16 overflow-hidden rounded-sm outline-offset-2 transition-all ${
        selected
          ? "outline outline-1 outline-brand-ink"
          : "opacity-80 hover:opacity-100 hover:outline hover:outline-1 hover:outline-brand-gold"
      }`}
    >
      <Image
        src={image}
        alt={label}
        fill
        sizes="64px"
        className="object-cover"
      />
    </button>
  );
}

export default function AddToCartForm({ product, sizes = [] }: Props) {
  const { addItem } = useCart();
  // Null when the design comes in one colour — then nothing colour-related is
  // shown and the cart line carries no colour, exactly as before.
  const color = useProductColor();
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
      // The picked colour's own picture, so the cart shows what was chosen.
      image: color?.selected || product.image,
      price: unitPrice,
      quantity: qty,
      size: size || undefined,
      color: color?.selected || undefined,
      colorLabel: color?.selectedLabel || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Colour — the same design, photographed in each colour it comes in. */}
      {color && color.colors.length > 0 && (
        <div>
          <p className="field-label">
            Colour
            <span className="ml-2 normal-case tracking-normal text-brand-inkMuted">
              {color.selected ? color.selectedLabel : "as shown"}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {/* The design's own pictures are a colour too — this resets to them. */}
            <ColorChoice
              image={product.image}
              label="Colour as shown in the main pictures"
              selected={!color.selected}
              onSelect={() => color.select("")}
            />
            {color.colors.map((image, index) => (
              <ColorChoice
                key={image}
                image={image}
                label={`Colour ${index + 2}`}
                selected={color.selected === image}
                onSelect={() => color.select(image)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size — options come from the admin; nothing is shown when none were set. */}
      {sizes.length > 0 && (
        <div>
          <p className="field-label">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((option) => {
              const selected = size === option.label;
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setSize(option.label)}
                  aria-pressed={selected}
                  className={`min-w-[4.5rem] rounded-sm border px-4 py-2.5 text-center text-sm transition-colors ${
                    selected
                      ? "border-brand-ink bg-brand-ink text-brand-ivory"
                      : "border-brand-ink/15 text-brand-ink hover:border-brand-ink"
                  }`}
                >
                  <span className="block font-medium uppercase tracking-[0.1em]">
                    {option.label}
                  </span>
                  {/* Each size carries its own price — show it on the chip so the
                      choice is never a surprise at checkout. */}
                  {sizePriced && (
                    <span
                      className={`mt-0.5 block text-xs ${
                        selected ? "text-brand-goldSoft" : "text-brand-inkMuted"
                      }`}
                    >
                      {formatPrice(
                        priceForSize(product.price, sizes, option.label),
                      )}
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
        <label className="field-label">
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
            <span className="text-xs uppercase tracking-[0.12em] text-brand-inkMuted">
              {product.stock} in stock
            </span>
          )}
        </div>
        {canReachBulk && unitsAway > 0 && (
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-brand-plum">
            Add {unitsAway} more ({BULK_MIN_QUANTITY}+) and get{" "}
            {BULK_DISCOUNT_PERCENT}% off.
          </p>
        )}
      </div>

      {/* Live price for the chosen quantity */}
      <dl className="space-y-2 border border-brand-ink/10 bg-brand-cream p-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-brand-inkSoft">
            {formatPrice(unitPrice)} × {qty}
            {size && sizePriced ? ` (${size})` : ""}
          </dt>
          <dd className="font-medium text-brand-ink">
            {formatPrice(gross)}
          </dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-brand-plum">
            <dt>Bulk discount ({discountPct}%)</dt>
            <dd className="font-semibold">− {formatPrice(discount)}</dd>
          </div>
        )}
        <div className="flex items-baseline justify-between border-t border-brand-ink/10 pt-3">
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink">
            Total
          </dt>
          <dd className="font-display text-xl text-brand-ink">
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
          className="btn btn-candy flex-1"
        >
          {outOfStock
            ? "Out of stock"
            : added
              ? "✓ Added to cart"
              : "Add to cart"}
        </button>
        <Link
          href="/cart"
          className="btn btn-outline"
        >
          Go to cart
        </Link>
      </div>
    </div>
  );
}
