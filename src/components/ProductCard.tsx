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
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-brand">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-gray-100"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-pink px-2.5 py-1 text-xs font-bold text-brand-dark shadow sm:left-3 sm:top-3">
            -{discount}%
          </span>
        )}
        {outOfStock && (
          <span className="absolute inset-0 grid place-items-center bg-black/50 text-sm font-bold uppercase tracking-wide text-white">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
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
          <h3 className="line-clamp-2 font-semibold text-brand-dark hover:text-brand-pink">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 sm:mt-3">
          {sizePriced && (
            <span className="text-xs font-semibold text-gray-500">From</span>
          )}
          <span className="text-lg font-extrabold text-brand-dark">
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
              className="block w-full rounded-full bg-brand-dark px-3 py-2.5 text-center text-sm font-bold text-white transition-all hover:bg-brand-purple sm:px-4"
            >
              Choose size
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
