import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8 flex flex-col items-center sm:mb-10">
        <div className="h-3 w-24 animate-pulse bg-brand-sand" />
        <div className="mt-4 h-9 w-64 animate-pulse bg-brand-sand" />
        <div className="mt-5 h-3 w-32 animate-pulse bg-brand-sand" />
      </div>
      <div className="mb-8 flex justify-center gap-2.5 border-y border-brand-ink/10 py-4 sm:mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-24 animate-pulse bg-brand-sand" />
        ))}
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}
