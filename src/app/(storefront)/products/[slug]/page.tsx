import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartForm from "@/components/AddToCartForm";
import ProductCard from "@/components/ProductCard";
import ProductColorGallery from "@/components/ProductColorGallery";
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
import { parseColorImages } from "@/lib/colors";
import { ProductColorProvider } from "@/context/ProductColorContext";
import { BULK_DISCOUNT_PERCENT, BULK_MIN_QUANTITY } from "@/lib/pricing";
import { breadcrumbSchema, productSchema } from "@/lib/seo";
import { mirrorsProductType } from "@/lib/types";
import SectionHeading from "@/components/SectionHeading";

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
    ? product.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : undefined;
  return {
    title: product.name,
    description,
    keywords: tags,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      images: [
        { url: product.image, width: 800, height: 800, alt: product.name },
      ],
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
  // Colours this design comes in, each with its own pictures. Empty means the
  // design is sold in one colour and nothing colour-related is rendered.
  const colorImages = parseColorImages(product.colors);
  const gallery = productGallery(product.image, product.images);
  const { min: minPrice, max: maxPrice } = sizePriceRange(
    effectivePrice,
    sizes,
  );

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
      {
        name: product.category.name,
        path: `/category/${product.category.slug}`,
      },
      { name: product.name, path: `/products/${product.slug}` },
    ]),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-9 lg:px-8">
      <JsonLd data={jsonLd} />

      {/* Breadcrumb */}
      <nav className="mb-5 truncate text-xs uppercase tracking-[0.14em] text-brand-inkMuted sm:mb-8">
        <Link href="/" className="transition-colors hover:text-brand-ink">
          Home
        </Link>
        <span className="px-2 text-brand-gold">/</span>
        <Link
          href={`/category/${product.category.slug}`}
          className="transition-colors hover:text-brand-ink"
        >
          {product.category.name}
        </Link>
        <span className="px-2 text-brand-gold">/</span>
        <span className="text-brand-ink">{product.name}</span>
      </nav>

      <ProductColorProvider colors={colorImages} productImages={gallery}>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
          {/* Media — follows the colour picked in the form below. */}
          <ProductColorGallery
            images={gallery}
            video={product.video}
            name={product.name}
            discount={discount}
          />

          {/* Details */}
          <div>
            {/* The breadcrumb above and the type badge below already name the
              category when it mirrors the product type — don't say it a third
              time. */}
            {!mirrorsProductType(
              product.category.slug,
              product.productType,
            ) && (
              <Link
                href={`/category/${product.category.slug}`}
                className="eyebrow"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="mt-3 font-display text-3xl font-normal leading-tight tracking-tight text-brand-ink sm:text-[2.75rem]">
              {product.name}
            </h1>
            <div className="rule-gold mt-5 w-20" aria-hidden="true" />

            <div className="mt-5">
              <Link href={`/products?type=${product.productType}`}>
                <ProductTypeBadge
                  productType={product.productType}
                  customType={product.customType}
                  size="md"
                  className="transition-colors hover:border-brand-gold hover:text-brand-ink"
                />
              </Link>
            </div>

            {/* With per-size prices there is no single price — show the range and
              let the size picker below settle on the exact one. */}
            <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-3xl text-brand-ink sm:text-4xl">
                {sizePriced && minPrice !== maxPrice
                  ? `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`
                  : formatPrice(sizePriced ? minPrice : effectivePrice)}
              </span>
              {!sizePriced && product.salePrice && (
                <span className="text-lg text-brand-inkMuted line-through">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className="text-xs uppercase tracking-[0.12em] text-brand-inkMuted">
                / piece
                {sizePriced ? " — price depends on the size you pick" : ""}
              </span>
            </div>

            <p className="mt-4 inline-flex items-center gap-2 border border-brand-gold/40 bg-brand-cream px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-brand-inkSoft">
              <span aria-hidden="true">✦</span>
              Buy {BULK_MIN_QUANTITY}+ and save {BULK_DISCOUNT_PERCENT}%
            </p>

            <p className="mt-6 leading-relaxed text-brand-inkSoft">
              {product.description}
            </p>

            <div className="mt-6 border-t border-brand-ink/10 pt-6">
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

            <ul className="mt-7 grid grid-cols-2 gap-px border border-brand-ink/10 bg-brand-ink/10">
              {[
                "Premium fabric",
                "Custom stitching",
                "Dispatched in 24h",
                "Cash on delivery",
              ].map((promise) => (
                <li
                  key={promise}
                  className="bg-brand-ivory px-4 py-3.5 text-xs uppercase tracking-[0.12em] text-brand-inkSoft"
                >
                  {promise}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ProductColorProvider>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12 border-t border-brand-ink/10 pt-10 sm:mt-16 sm:pt-14">
          <SectionHeading eyebrow="Styled with" title="You may also like" />
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-10 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
