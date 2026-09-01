"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for debugging without crashing the UI
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6 sm:py-24">
      <div className="text-6xl">😵</div>
      <h1 className="mt-4 font-display text-2xl font-extrabold text-brand-dark sm:text-3xl">
        Oops, kuch ghalat ho gaya
      </h1>
      <p className="mt-2 text-gray-500">
        Something went wrong while loading this page. Please try again — it's
        usually a quick hiccup.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-brand-gradient px-7 py-3.5 font-bold text-brand-dark shadow-brand transition-transform hover:scale-105"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-brand-dark/15 px-7 py-3.5 font-bold text-brand-dark transition-colors hover:bg-black/5"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
