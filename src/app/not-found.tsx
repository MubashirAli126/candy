import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <div className="font-display text-7xl font-extrabold text-shine">404</div>
      <h1 className="mt-4 font-display text-3xl font-extrabold text-brand-dark">
        Page not found
      </h1>
      <p className="mt-2 text-gray-500">
        Oops! This page is out of stock. Let's get you back.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-brand-gradient px-7 py-3.5 font-bold text-brand-dark shadow-brand"
      >
        Back to home
      </Link>
    </div>
  );
}
