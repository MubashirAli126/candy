import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartForm from "@/components/AddToCartForm";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import JsonLd from "@/components/JsonLd";
import ProductTypeBadge from "@/components/ProductTypeBadge";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import {
  formatPrice,
  discountPercent,
  parseImages,
  productGallery,
} from "@/lib/utils";
import { hasSizePrices, parseSizeOptions, sizePriceRange } from "@/lib/sizes";
import { BULK_DISCOUNT_PERCENT, BULK_MIN_QUANTITY } from "@/lib/pricing";
import { breadcrumbSchema, productSchema } from "@/lib/seo";
import { mirrorsProductType } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };
  const description = product.description.slice(0, 160);
  const tags = product.tags
    ? product.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : undefined;
  return {
    title: product.name,
    description,
    keywords: tags,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      images: [{ url: product.image, width: 800, height: 800, alt: product.name }],
      type: "website",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product || !product.active) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);
  const effectivePrice = product.salePrice ?? product.price;
  const discount = discountPercent(product.price, product.salePrice);
  // Sizes are whatever the admin entered for this product — never hardcoded —
  // and each one can carry its own price.
  const sizes = parseSizeOptions(product.size);
  const sizePriced = hasSizePrices(sizes);
  const { min: minPrice, max: maxPrice } = sizePriceRange(effectivePrice, sizes);

  const jsonLd = [
    productSchema({
      name: product.name,
      slug: product.slug,
      description: product.description,
      image: product.image,
      images: parseImages(product.images),
      // With per-size prices the offer starts at the cheapest size, which is
      // also what the page shows.
      price: sizePriced ? minPrice : product.price,
      salePrice: sizePriced ? null : product.salePrice,
      stock: product.stock,
      categoryName: product.category.name,
      sku: product.id,
    }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: product.category.name, path: `/category/${product.category.slug}` },
      { name: product.name, path: `/products/${product.slug}` },
    ]),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <JsonLd data={jsonLd} />

      {/* Breadcrumb */}
      <nav className="mb-5 text-sm text-gray-500 sm:mb-6">
        <Link href="/" className="hover:text-brand-purple">
          Home
        </Link>{" "}
        /{" "}
        <Link
          href={`/category/${product.category.slug}`}
          className="hover:text-brand-purple"
        >
          {product.category.name}
        </Link>{" "}
        / <span className="text-brand-dark">{product.name}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        {/* Media */}
        <ProductGallery
          images={productGallery(product.image, product.images)}
          video={product.video}
          name={product.name}
          discount={discount}
        />

        {/* Details */}
        <div>
          {/* The breadcrumb above and the type badge below already name the
              category when it mirrors the product type — don't say it a third
              time. */}
          {!mirrorsProductType(product.category.slug, product.productType) && (
            <Link
              href={`/category/${product.category.slug}`}
              className="text-sm font-semibold uppercase tracking-wide text-brand-purple"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="mt-2 font-display text-3xl font-extrabold text-brand-dark sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3">
            <Link href={`/products?type=${product.productType}`}>
              <ProductTypeBadge
                productType={product.productType}
                customType={product.customType}
                size="md"
                className="transition-colors hover:bg-brand-purple/20"
              />
            </Link>
          </div>

          {/* With per-size prices there is no single price — show the range and
              let the size picker below settle on the exact one. */}
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-display text-3xl font-extrabold text-brand-dark">
              {sizePriced && minPrice !== maxPrice
                ? `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`
                : formatPrice(sizePriced ? minPrice : effectivePrice)}
            </span>
            {!sizePriced && product.salePrice && (
              <span className="text-xl text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="text-sm text-gray-500">
              / piece{sizePriced ? " — price depends on the size you pick" : ""}
            </span>
          </div>

          <p className="mt-2 text-sm font-semibold text-brand-purple">
            🎉 Buy {BULK_MIN_QUANTITY} or more and get {BULK_DISCOUNT_PERCENT}% off
          </p>

          <p className="mt-5 leading-relaxed text-gray-600">
            {product.description}
          </p>

          <div className="mt-8 border-t border-black/5 pt-8">
            <AddToCartForm
              product={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: effectivePrice,
                image: product.image,
                stock: product.stock,
              }}
              sizes={sizes}
            />
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-3 text-sm text-gray-600">
            <li className="flex items-center gap-2">🧵 Premium fabric</li>
            <li className="flex items-center gap-2">📏 Custom stitching</li>
            <li className="flex items-center gap-2">🚚 24h dispatch</li>
            <li className="flex items-center gap-2">💵 Cash on delivery</li>
          </ul>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12 sm:mt-16">
          <h2 className="mb-6 font-display text-2xl font-extrabold text-brand-dark">
            You may also like
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
