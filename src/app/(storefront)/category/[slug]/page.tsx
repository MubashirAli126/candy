import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import JsonLd from "@/components/JsonLd";
import { getAllProducts, getCategoryBySlug } from "@/lib/data";
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
      <nav className="mb-4 text-sm text-gray-500">
        <a href="/" className="hover:text-brand-purple">
          Home
        </a>{" "}
        / <span className="text-brand-dark">{category.name}</span>
      </nav>

      <header className="mb-6 rounded-3xl bg-brand-gradient-soft p-6 text-brand-dark shadow-brand sm:mb-8 sm:p-8">
        <div className="text-4xl sm:text-5xl">{category.icon}</div>
        <h1 className="mt-3 font-display text-2xl font-extrabold sm:text-4xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 max-w-2xl text-brand-dark/80">{category.description}</p>
        )}
      </header>

      {products.length === 0 ? (
        <p className="rounded-2xl bg-gray-50 p-10 text-center text-gray-500">
          No products in this category yet.
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
