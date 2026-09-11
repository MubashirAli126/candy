import Image from "next/image";
import Link from "next/link";
import { formatPrice, discountPercent } from "@/lib/utils";
import { mirrorsProductType } from "@/lib/types";
import { hasSizePrices, parseSizeOptions, sizePriceRange } from "@/lib/sizes";
import QuickAddButton from "./QuickAddButton";
import ProductTypeBadge from "./ProductTypeBadge";

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  price: number;
  salePrice: number | null;
  image: string;
  /** Second gallery picture, revealed on hover — undefined when there is none. */
  hoverImage?: string;
  stock: number;
  /** Raw sizes column — carries the per-size prices (see @/lib/sizes). */
  size?: string | null;
  productType?: string | null;
  customType?: string | null;
  categoryName?: string;
  categorySlug?: string;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const effectivePrice = product.salePrice ?? product.price;
  const discount = discountPercent(product.price, product.salePrice);
  const outOfStock = product.stock <= 0;
  // When sizes are priced individually a card cannot quote one price, and
  // adding to the cart from here would guess the size — send the buyer to the
  // product page to pick one instead.
  const sizeOptions = parseSizeOptions(product.size);
  const sizePriced = hasSizePrices(sizeOptions);
  const { min: minPrice } = sizePriceRange(effectivePrice, sizeOptions);
  // "Kurtis" next to a "Kurti" badge is the same word twice — show the
  // category only when it adds something the type badge does not.
  const showCategory =
    Boolean(product.categoryName) &&
    !mirrorsProductType(product.categorySlug, product.productType);

  return (
    <div className="group relative flex flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden bg-brand-cream"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={
            product.hoverImage
              ? "object-cover transition-opacity duration-700 group-hover:opacity-0"
              : "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          }
        />
        {/* Front/back shot swap — the reference cards flip to the second
            picture on hover, which only works when one exists. */}
        {product.hoverImage && (
          <Image
            src={product.hoverImage}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}

        {/* Hairline inset frame — separates the picture from the paper on
            hover without drawing a permanent heavy border. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 border border-white/0 transition-colors duration-500 group-hover:border-white/40"
        />

        {discount > 0 && (
          <span className="absolute left-0 top-4 bg-brand-ink px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-brand-goldSoft">
            −{discount}%
          </span>
        )}
        {outOfStock && (
          <span className="absolute inset-0 grid place-items-center bg-brand-ink/55 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-[1px]">
            Sold out
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          {showCategory && (
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brand-gold">
              {product.categoryName}
            </span>
          )}
          {product.productType && (
            <ProductTypeBadge
              productType={product.productType}
              customType={product.customType}
            />
          )}
        </div>

        <Link href={`/products/${product.slug}`} className="flex-1">
          <h3 className="line-clamp-2 font-display text-base leading-snug text-brand-ink transition-colors group-hover:text-brand-plum sm:text-lg">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          {sizePriced && (
            <span className="text-xs uppercase tracking-[0.14em] text-brand-inkMuted">
              From
            </span>
          )}
          <span className="text-sm font-semibold tracking-wide text-brand-ink">
            {formatPrice(sizePriced ? minPrice : effectivePrice)}
          </span>
          {!sizePriced && product.salePrice && (
            <span className="text-xs text-brand-inkMuted line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4">
          {sizePriced && !outOfStock ? (
            <Link
              href={`/products/${product.slug}`}
              className="btn btn-outline btn-sm w-full"
            >
              Choose options
            </Link>
          ) : (
            <QuickAddButton
              product={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: effectivePrice,
                image: product.image,
                stock: product.stock,
              }}
              disabled={outOfStock}
            />
          )}
        </div>
      </div>
    </div>
  );
}
