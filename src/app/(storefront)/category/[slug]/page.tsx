import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import JsonLd from "@/components/JsonLd";
import { getAllProducts, getCategoryBySlug } from "@/lib/data";
import SectionHeading from "@/components/SectionHeading";
import { breadcrumbSchema, itemListSchema, SITE_NAME } from "@/lib/seo";

// Rendered on demand — no generateStaticParams, so the build never needs the
// database (categories are managed from the admin panel and change at runtime).
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return { title: "Category not found" };
  return {
    title: category.name,
    description:
      category.description ??
      `Shop premium ${category.name.toLowerCase()} at ${SITE_NAME}.`,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: {
      title: `${category.name} | ${SITE_NAME}`,
      description: category.description ?? undefined,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const products = await getAllProducts(category.slug);

  const jsonLd = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: category.name, path: `/category/${category.slug}` },
    ]),
    itemListSchema(products),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <JsonLd data={jsonLd} />
      <nav className="mb-6 text-xs uppercase tracking-[0.14em] text-brand-inkMuted">
        <a href="/" className="transition-colors hover:text-brand-ink">
          Home
        </a>
        <span className="px-2 text-brand-gold">/</span>
        <span className="text-brand-ink">{category.name}</span>
      </nav>

      <header className="mb-8 border-y border-brand-ink/10 bg-brand-cream px-6 py-9 sm:mb-10 sm:py-12">
        <div className="mb-4 text-center text-4xl sm:text-5xl" aria-hidden="true">
          {category.icon}
        </div>
        <SectionHeading
          as="h1"
          eyebrow="Collection"
          title={category.name}
          subtitle={category.description ?? undefined}
        />
      </header>

      {products.length === 0 ? (
        <p className="border border-brand-ink/10 bg-brand-cream p-12 text-center text-sm text-brand-inkSoft">
          No products in this category yet.
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
