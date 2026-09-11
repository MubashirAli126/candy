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
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-4 font-display text-3xl font-normal tracking-tight text-brand-ink sm:text-4xl">
        Kuch ghalat ho gaya
      </h1>
      <div className="rule-gold mx-auto mt-5 w-20" aria-hidden="true" />
      <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-brand-inkSoft sm:text-base">
        This page did not load. It is usually a quick hiccup — try once more.
      </p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <button type="button" onClick={reset} className="btn btn-primary">
          Try again
        </button>
        <Link href="/" className="btn btn-outline">
          Back to home
        </Link>
      </div>
    </div>
  );
}
