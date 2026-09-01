import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-4 h-4 w-40 animate-pulse rounded bg-gray-200" />
      <div className="mb-6 h-32 animate-pulse rounded-3xl bg-gray-200 sm:mb-8 sm:h-40" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}
