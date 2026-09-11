import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import SectionHeading from "@/components/SectionHeading";
import AssuranceStrip from "@/components/AssuranceStrip";
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

      <AssuranceStrip />

      {/* Product grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <SectionHeading
          eyebrow="Hand-picked"
          title="This season's favourites"
          subtitle="The designs our customers keep coming back for."
        />

        {grid.length === 0 ? (
          <p className="mt-8 border border-brand-ink/10 bg-brand-cream p-10 text-center text-sm text-brand-inkSoft">
            No products yet. Run <code>npm run setup</code> to seed sample data.
          </p>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-10 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-4">
              {grid.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="mt-9 text-center sm:mt-12">
              <Link href="/products" className="btn btn-outline btn-lg">
                View all products
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Atelier note — the classic closing band, ink on ink with a gold rule */}
      <section className="bg-brand-night bg-brand-paper">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8">
          <SectionHeading
            tone="dark"
            eyebrow="From our studio"
            title="Made to be worn, not just photographed"
            subtitle="We choose the fabric, pick the print and stitch every suit ourselves in Karachi. Nothing is drop-shipped — the colour, the fit and the finish are ours to answer for."
          />
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/about" className="btn btn-ghost">
              Our story
            </Link>
            <Link href="/contact" className="btn btn-gold">
              Custom stitching
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
