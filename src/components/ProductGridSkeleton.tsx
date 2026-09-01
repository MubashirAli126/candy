/**
 * Loading placeholders shown while server data streams in.
 * Mirrors the real ProductCard / product-detail layout so the page
 * doesn't visually "jump" once content arrives.
 */

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card">
      <div className="aspect-square animate-pulse bg-gray-200" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="mt-1 h-9 w-full animate-pulse rounded-full bg-gray-200" />
      </div>
    </div>
  );
}

export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
