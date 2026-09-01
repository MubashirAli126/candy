import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts, getCategories } from "@/lib/data";
import { SITE_NAME_SHORT } from "@/lib/seo";

export const dynamic = "force-dynamic";

const CATEGORY_META: Record<
  string,
  { blurb: string; gradient: string; emoji: string }
> = {
  "3-piece": {
    blurb: "Shirt, trouser & dupatta — complete stitched suits",
    gradient: "from-brand-plum to-brand-pink",
    emoji: "👗",
  },
  "2-piece": {
    blurb: "Shirt & trouser sets for everyday elegance",
    gradient: "from-brand-night to-brand-purple",
    emoji: "🧵",
  },
  kurti: {
    blurb: "Casual, formal & embroidered kurtis",
    gradient: "from-brand-purple via-brand-pink to-brand-rose",
    emoji: "👚",
  },
};

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-night text-white">
        <div className="absolute inset-0 bg-brand-gradient opacity-20" />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-pink/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-brand-purple/30 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:py-24 lg:px-8">
          <div>
            <h1 className="font-display text-[2rem] font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Sweeten your wardrobe with{" "}
              <span className="text-shine">Candy</span> stitched suits
            </h1>
            <p className="mt-4 max-w-lg text-base text-white/70 sm:mt-5 sm:text-lg">
              Ladies 3 piece &amp; 2 piece suits and kurtis in premium fabric.
              Fresh seasonal designs, fast cash-on-delivery all across Pakistan.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
              <Link
                href="/products"
                className="rounded-full bg-brand-gradient px-7 py-3.5 font-bold text-brand-dark shadow-brand transition-transform hover:scale-105"
              >
                Shop all dresses
              </Link>
              <Link
                href="/category/3-piece"
                className="rounded-full border border-white/20 bg-white/5 px-7 py-3.5 font-bold text-white backdrop-blur transition-colors hover:bg-white/10"
              >
                Explore categories
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4 text-sm text-white/60 sm:mt-10 sm:gap-x-8">
              <div>
                <div className="font-display text-2xl font-bold text-white">
                  500+
                </div>
                Happy customers
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-white">
                  100%
                </div>
                Premium fabric
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-white">
                  24h
                </div>
                Fast dispatch
              </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="relative mx-auto aspect-square max-w-md animate-float">
              <div className="absolute inset-0 rounded-[2.5rem] bg-brand-gradient blur-2xl opacity-40" />
              <Image
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80"
                alt="Ladies stitched suit collection"
                fill
                priority
                sizes="(max-width: 1024px) 0px, 400px"
                className="rounded-[2.5rem] object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="font-display text-3xl font-extrabold text-brand-dark sm:text-4xl">
            Shop by category
          </h2>
          <p className="mt-3 text-gray-500">
            Whatever the occasion — we've got the outfit for it.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat.slug] ?? {
              blurb: cat.description ?? "",
              gradient: "from-brand-navy to-brand-copper",
              emoji: cat.icon ?? "⭐",
            };
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${meta.gradient} p-6 text-white shadow-card transition-transform hover:-translate-y-1 sm:p-8`}
              >
                <div className="text-4xl sm:text-5xl">{meta.emoji}</div>
                <h3 className="mt-3 font-display text-xl font-extrabold sm:mt-4 sm:text-2xl">
                  {cat.name}
                </h3>
                <p className="mt-2 text-sm text-white/80">{meta.blurb}</p>
                <p className="mt-4 text-sm font-semibold">
                  {cat._count.products} products →
                </p>
                <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10 transition-transform group-hover:scale-125" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16">
        <div className="mb-6 flex items-end justify-between sm:mb-8">
          <div>
            <h2 className="font-display text-3xl font-extrabold text-brand-dark sm:text-4xl">
              Bestsellers
            </h2>
            <p className="mt-2 text-gray-500">Our most-loved seasonal picks.</p>
          </div>
          <Link
            href="/products"
            className="hidden shrink-0 rounded-full border border-brand-purple/20 px-5 py-2.5 text-sm font-bold text-brand-purple hover:bg-brand-purple/5 sm:block"
          >
            View all
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="rounded-2xl bg-gray-50 p-10 text-center text-gray-500">
            No products yet. Run <code>npm run setup</code> to seed sample data.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="mt-8 text-center sm:mt-10">
              <p className="text-gray-500">
                Looking for something specific? Explore our full collection.
              </p>
              <Link
                href="/products"
                className="mt-4 inline-block rounded-full bg-brand-gradient px-8 py-3.5 font-bold text-brand-dark shadow-brand transition-transform hover:scale-105"
              >
                View all products
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Our story */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16">
        <div className="overflow-hidden rounded-3xl bg-brand-dark px-6 py-10 text-white sm:px-10 sm:py-14">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-brand-gradient px-4 py-1 text-sm font-bold text-brand-dark">
              Stitched with care
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
              From our <span className="text-shine">Karachi</span> studio to all
              of Pakistan
            </h2>
            <p className="mt-4 text-white/70">
              <strong className="text-white">{SITE_NAME_SHORT}</strong> picks the
              fabric, prints the design and stitches every suit in our own
              Karachi studio — so the colour, the fit and the finish are ours to
              answer for. Order online and it reaches you anywhere in Pakistan.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block rounded-full border border-white/20 bg-white/5 px-6 py-3 font-bold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              Read our story
            </Link>
            <p className="mt-5 text-sm text-white/60">
              Plus custom stitching to your own measurements. 🎉
            </p>
          </div>
        </div>
      </section>

      {/* Trust / features strip */}
      <section className="bg-gray-50 py-10 sm:py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:gap-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { icon: "🚚", title: "Fast delivery", text: "Dispatched within 24 hours nationwide." },
            { icon: "🧵", title: "Premium fabric", text: "Lawn, linen & khaddar that keeps its colour." },
            { icon: "📏", title: "Custom stitching", text: "Send your measurements, we'll stitch to fit." },
            { icon: "💵", title: "Cash on delivery", text: "Pay when it reaches your doorstep." },
          ].map((f) => (
            <div key={f.title} className="text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-3xl shadow-card">
                {f.icon}
              </div>
              <h3 className="mt-4 font-display font-bold text-brand-dark">
                {f.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
