import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import JsonLd from "@/components/JsonLd";
import {
  getAllProducts,
  getCategories,
  getProductTypeCounts,
} from "@/lib/data";
import { itemListSchema, SITE_NAME } from "@/lib/seo";
import { cn } from "@/lib/utils";
import {
  PRODUCT_TYPE_OPTIONS,
  isProductType,
  mirrorsProductType,
} from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Items",
  description: `Browse every ladies 3 piece, 2 piece suit and kurti at ${SITE_NAME}. Premium fabric, fresh designs, cash on delivery across Pakistan.`,
  alternates: { canonical: "/products" },
};

const chipClass =
  "whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors";

/** Keep the other active filter when building a filter link. */
function filterHref(category?: string, type?: string): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (type) params.set("type", type);
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; type?: string };
}) {
  const activeCat = searchParams.category;
  // Ignore an unknown ?type= rather than 404ing — the filter is a convenience.
  const activeType = isProductType(searchParams.type)
    ? searchParams.type
    : undefined;

  const [products, allCategories, typeCounts] = await Promise.all([
    getAllProducts(activeCat, activeType),
    getCategories(),
    getProductTypeCounts(),
  ]);

  // 3 Piece / 2 Piece / Kurti / Other already have a type chip — showing their
  // categories too would repeat the same names. Keep only the extra ones (and
  // whichever category is currently active, so the filter stays visible).
  const categories = allCategories.filter(
    (c) => !mirrorsProductType(c.slug) || c.slug === activeCat
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <JsonLd data={itemListSchema(products)} />
      <header className="mb-6 sm:mb-8">
        <h1 className="font-display text-3xl font-extrabold text-brand-dark sm:text-4xl">
          All Items
        </h1>
        <p className="mt-2 text-gray-500">
          {products.length} product{products.length !== 1 && "s"} available
        </p>
      </header>

      {/* Single combined filter row — product types and categories together */}
      <div className="mb-6 sm:mb-8">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          <Link
            href={filterHref()}
            className={cn(chipClass, !activeCat && !activeType
              ? "bg-brand-dark text-white"
              : "bg-gray-100 text-brand-dark hover:bg-gray-200")}
          >
            All Items
          </Link>
          {PRODUCT_TYPE_OPTIONS.map((option) => {
            const count = typeCounts[option.value] ?? 0;
            return (
              <Link
                key={`type-${option.value}`}
                href={filterHref(activeCat, option.value)}
                className={cn(chipClass, activeType === option.value
                  ? "bg-brand-purple text-white"
                  : "bg-gray-100 text-brand-dark hover:bg-gray-200")}
              >
                <span aria-hidden="true">{option.icon}</span> {option.shortLabel}
                {count > 0 && (
                  <span className="ml-1 text-xs opacity-70">({count})</span>
                )}
              </Link>
            );
          })}
          {categories.map((c) => (
            <Link
              key={`cat-${c.id}`}
              href={filterHref(c.slug, activeType)}
              className={cn(chipClass, activeCat === c.slug
                ? "bg-brand-dark text-white"
                : "bg-gray-100 text-brand-dark hover:bg-gray-200")}
            >
              {c.icon} {c.name}
            </Link>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <p className="rounded-2xl bg-gray-50 p-10 text-center text-gray-500">
          No products match these filters.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
