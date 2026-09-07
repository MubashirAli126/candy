import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import { getFeaturedProducts, getLatestProducts } from "@/lib/data";
import { getHeroSlides } from "@/lib/slides";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, latest, slides] = await Promise.all([
    getFeaturedProducts(8),
    getLatestProducts(16),
    getHeroSlides(),
  ]);

  // Featured picks lead the grid; the newest arrivals fill the rest without
  // repeating anything already shown.
  const featuredIds = new Set(featured.map((p) => p.id));
  const grid = [...featured, ...latest.filter((p) => !featuredIds.has(p.id))];

  return (
    <>
      <HeroCarousel slides={slides} />

      {/* Product grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <h2 className="mb-6 text-center font-display text-2xl font-extrabold uppercase tracking-[0.14em] text-brand-dark sm:mb-10 sm:text-3xl">
          Best Sellers
        </h2>
        {grid.length === 0 ? (
          <p className="rounded-2xl bg-gray-50 p-10 text-center text-gray-500">
            No products yet. Run <code>npm run setup</code> to seed sample data.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
              {grid.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/products"
                className="inline-block border border-brand-dark px-10 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-dark transition-colors hover:bg-brand-dark hover:text-white"
              >
                View all products
              </Link>
            </div>
          </>
        )}
      </section>
    </>
  );
}
