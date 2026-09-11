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
import SectionHeading from "@/components/SectionHeading";
import { cn } from "@/lib/utils";
import {
  PRODUCT_TYPE_OPTIONS,
  isProductType,
  mirrorsProductType,
} from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pret — Ready to Wear",
  description: `Browse every ladies 3 piece, 2 piece suit and kurti at ${SITE_NAME}. Premium fabric, fresh designs, cash on delivery across Pakistan.`,
  alternates: { canonical: "/products" },
};

/** Filter chips: a hairline outline by default, solid ink when active. */
const chipClass =
  "whitespace-nowrap rounded-sm border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors";
const chipIdle =
  "border-brand-ink/15 bg-transparent text-brand-inkSoft hover:border-brand-ink hover:text-brand-ink";
const chipActive = "border-brand-ink bg-brand-ink text-brand-ivory";

/** Keep the other active filters when building a filter link. */
function filterHref(category?: string, type?: string, q?: string): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (type) params.set("type", type);
  if (q) params.set("q", q);
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; type?: string; q?: string };
}) {
  const activeCat = searchParams.category;
  // Ignore an unknown ?type= rather than 404ing — the filter is a convenience.
  const activeType = isProductType(searchParams.type)
    ? searchParams.type
    : undefined;
  const query = searchParams.q?.trim() || undefined;

  const [products, allCategories, typeCounts] = await Promise.all([
    getAllProducts(activeCat, activeType, query),
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
    <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
      <JsonLd data={itemListSchema(products)} />
      <header className="mb-8 sm:mb-10">
        <SectionHeading
          as="h1"
          eyebrow={query ? "Search results" : "Ready to wear"}
          title={query ? `“${query}”` : "Pret Collection"}
          subtitle={`${products.length} design${
            products.length !== 1 ? "s" : ""
          } available`}
        />
        {query && (
          <p className="mt-5 text-center">
            <Link
              href={filterHref(activeCat, activeType)}
              className="link-underline text-xs font-semibold uppercase tracking-[0.16em] text-brand-pink"
            >
              Clear search
            </Link>
          </p>
        )}
      </header>

      {/* Single combined filter row — product types and categories together */}
      <div className="mb-8 border-y border-brand-ink/10 py-4 sm:mb-10">
        <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 sm:mx-0 sm:justify-center sm:px-0">
          <Link
            href={filterHref(undefined, undefined, query)}
            className={cn(chipClass, !activeCat && !activeType ? chipActive : chipIdle)}
          >
            All Items
          </Link>
          {PRODUCT_TYPE_OPTIONS.map((option) => {
            const count = typeCounts[option.value] ?? 0;
            return (
              <Link
                key={`type-${option.value}`}
                href={filterHref(activeCat, option.value, query)}
                className={cn(chipClass, activeType === option.value ? chipActive : chipIdle)}
              >
                <span aria-hidden="true">{option.icon}</span> {option.shortLabel}
                {count > 0 && <span className="ml-1.5 opacity-60">({count})</span>}
              </Link>
            );
          })}
          {categories.map((c) => (
            <Link
              key={`cat-${c.id}`}
              href={filterHref(c.slug, activeType, query)}
              className={cn(chipClass, activeCat === c.slug ? chipActive : chipIdle)}
            >
              {c.icon} {c.name}
            </Link>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <p className="border border-brand-ink/10 bg-brand-cream p-12 text-center text-sm text-brand-inkSoft">
          {query
            ? `Nothing matched “${query}”. Try a different search.`
            : "No products match these filters."}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
