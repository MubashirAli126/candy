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
        className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5"
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
        className="h-10 w-36 rounded-full border border-brand-blush bg-brand-mist px-4 text-sm text-brand-dark outline-none placeholder:text-brand-dark/40 focus:border-brand-pink sm:w-56"
      />
      <button
        type="submit"
        className="-ml-10 grid h-10 w-10 place-items-center rounded-full text-brand-purple"
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
      className="h-5 w-5 text-brand-dark"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
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
