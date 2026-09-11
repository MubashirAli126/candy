/**
 * Loading placeholders shown while server data streams in.
 * Mirrors the real ProductCard / product-detail layout so the page
 * doesn't visually "jump" once content arrives.
 */

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="aspect-[3/4] animate-pulse bg-brand-cream" />
      <div className="flex flex-1 flex-col gap-3 pt-4">
        <div className="h-3 w-1/3 animate-pulse bg-brand-sand" />
        <div className="h-4 w-4/5 animate-pulse bg-brand-sand" />
        <div className="h-4 w-1/2 animate-pulse bg-brand-sand" />
        <div className="mt-1 h-10 w-full animate-pulse bg-brand-sand" />
      </div>
    </div>
  );
}

export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
