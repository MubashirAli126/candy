export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-9 lg:px-8">
      <div className="mb-5 h-3 w-64 animate-pulse bg-brand-sand sm:mb-8" />
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="aspect-square animate-pulse bg-brand-cream" />
        <div className="space-y-5">
          <div className="h-3 w-24 animate-pulse bg-brand-sand" />
          <div className="h-10 w-3/4 animate-pulse bg-brand-sand" />
          <div className="h-px w-20 animate-pulse bg-brand-sand" />
          <div className="h-8 w-1/3 animate-pulse bg-brand-sand" />
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full animate-pulse bg-brand-sand" />
            <div className="h-4 w-5/6 animate-pulse bg-brand-sand" />
            <div className="h-4 w-2/3 animate-pulse bg-brand-sand" />
          </div>
          <div className="h-12 w-full animate-pulse bg-brand-sand" />
        </div>
      </div>
    </div>
  );
}
