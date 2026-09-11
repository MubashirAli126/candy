"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Header search. Collapsed to an icon until tapped so the phone header keeps
 * its logo + cart row; submitting just hands the term to /products?q=.
 */
export default function HeaderSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState(params.get("q") ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = term.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid h-10 w-10 place-items-center rounded-sm transition-colors hover:bg-brand-sand"
        aria-label="Search products"
      >
        <SearchIcon />
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex items-center" role="search">
      <input
        ref={inputRef}
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onBlur={() => !term && setOpen(false)}
        placeholder="Search suits, kurtis…"
        aria-label="Search products"
        className="h-10 w-40 rounded-sm border border-brand-ink/15 bg-white px-4 text-sm text-brand-ink outline-none transition-colors placeholder:text-brand-inkMuted focus:border-brand-pink sm:w-60"
      />
      <button
        type="submit"
        className="-ml-10 grid h-10 w-10 place-items-center text-brand-pink"
        aria-label="Search"
      >
        <SearchIcon />
      </button>
    </form>
  );
}

function SearchIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
      />
    </svg>
  );
}
