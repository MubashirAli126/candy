export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-5 h-4 w-64 animate-pulse rounded bg-gray-200 sm:mb-6" />
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="aspect-square animate-pulse rounded-3xl bg-gray-200" />
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-9 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-12 w-full animate-pulse rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
