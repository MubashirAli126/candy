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
  // When sizes are priced individually a card can't quote one price, and adding
  // to the cart from here would guess the size — send the buyer to the product
  // page to pick one instead.
  const sizeOptions = parseSizeOptions(product.size);
  const sizePriced = hasSizePrices(sizeOptions);
  const { min: minPrice } = sizePriceRange(effectivePrice, sizeOptions);
  // "Kurtis" next to a "Kurti" badge is the same word twice — show the
  // category only when it adds something the type badge doesn't.
  const showCategory =
    Boolean(product.categoryName) &&
    !mirrorsProductType(product.categorySlug, product.productType);

  return (
    <div className="group relative flex flex-col bg-white">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden bg-brand-mist"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={
            product.hoverImage
              ? "object-cover transition-opacity duration-500 group-hover:opacity-0"
              : "object-cover transition-transform duration-500 group-hover:scale-105"
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
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {discount > 0 && (
          <span className="absolute left-0 top-3 bg-brand-logoRed px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Save {discount}%
          </span>
        )}
        {outOfStock && (
          <span className="absolute inset-0 grid place-items-center bg-black/45 text-sm font-bold uppercase tracking-wide text-white">
            Sold out
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-3">
        <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          {showCategory && (
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-purple">
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
          <h3 className="line-clamp-2 text-sm font-medium text-brand-dark hover:text-brand-pink">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          {sizePriced && (
            <span className="text-xs font-semibold text-gray-500">From</span>
          )}
          <span className="text-base font-extrabold text-brand-dark">
            {formatPrice(sizePriced ? minPrice : effectivePrice)}
          </span>
          {!sizePriced && product.salePrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-3">
          {sizePriced && !outOfStock ? (
            <Link
              href={`/products/${product.slug}`}
              className="block w-full border border-brand-dark px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-brand-dark transition-colors hover:bg-brand-dark hover:text-white sm:px-4"
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
