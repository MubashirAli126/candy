import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 sm:py-36">
      <p className="font-display text-6xl italic text-brand-gold sm:text-7xl">404</p>
      <div className="rule-gold mx-auto mt-6 w-24" aria-hidden="true" />
      <h1 className="mt-6 font-display text-3xl font-normal tracking-tight text-brand-ink sm:text-4xl">
        This page is out of stock
      </h1>
      <p className="mx-auto mt-4 max-w-sm text-sm text-brand-inkSoft sm:text-base">
        The page you were looking for has moved, or never existed. Let us get
        you back to the rail.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
        <Link href="/products" className="btn btn-outline">
          Browse the collection
        </Link>
      </div>
    </div>
  );
}
