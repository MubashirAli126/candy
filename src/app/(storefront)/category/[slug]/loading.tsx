import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-6 h-3 w-40 animate-pulse bg-brand-sand" />
      <div className="mb-8 h-44 animate-pulse border-y border-brand-ink/10 bg-brand-cream sm:mb-10 sm:h-56" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}
