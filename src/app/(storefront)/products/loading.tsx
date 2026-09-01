import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <div className="h-8 w-56 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="mb-6 flex gap-2 sm:mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-24 animate-pulse rounded-full bg-gray-200"
          />
        ))}
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}
