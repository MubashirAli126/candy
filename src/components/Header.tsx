"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import HeaderSearch from "./HeaderSearch";
import { useCart } from "@/context/CartContext";
import { MAIN_NAV, UTILITY_NAV } from "@/lib/site-links";
import { cn } from "@/lib/utils";

/** Drawer list: the whole nav plus any utility link it doesn't already carry. */
const MOBILE_NAV = [
  ...MAIN_NAV,
  ...UTILITY_NAV.filter((u) => !MAIN_NAV.some((m) => m.href === u.href)),
];

/** A nav item is active when the current path matches its destination path. */
function isActive(pathname: string, href: string): boolean {
  const path = href.split("?")[0];
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();
  const pathname = usePathname();

  // Route changes leave the drawer open otherwise — the link click closes it,
  // but a back/forward navigation does not.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-ink/10 bg-brand-ivory/90 backdrop-blur-md">
      {/* Utility row — desktop only, mirrors the slim strip above the logo. */}
      <div className="hidden border-b border-brand-ink/[0.07] lg:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-end gap-8 px-4 sm:px-6 lg:px-8">
          {UTILITY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-underline text-xs font-medium uppercase tracking-[0.16em] text-brand-inkSoft transition-colors hover:text-brand-ink"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Logo row */}
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:gap-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="-ml-2 grid h-10 w-10 place-items-center rounded-sm transition-colors hover:bg-brand-sand lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg
            className="h-5 w-5 text-brand-ink"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.6}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={open ? "M6 18 18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"}
            />
          </svg>
        </button>

        <Logo />

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Primary nav — sits beside the logo on desktop. */}
          <div className="mr-4 hidden items-center gap-9 lg:flex">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-active={isActive(pathname, item.href)}
                className={cn(
                  "link-underline text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
                  isActive(pathname, item.href)
                    ? "text-brand-ink"
                    : "text-brand-inkSoft hover:text-brand-ink"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* useSearchParams needs a Suspense boundary during prerender. */}
          <Suspense fallback={<span className="h-10 w-10" />}>
            <HeaderSearch />
          </Suspense>

          <Link
            href="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-sm transition-colors hover:bg-brand-sand"
            aria-label={`Cart, ${totalItems} items`}
          >
            <svg
              className="h-5 w-5 text-brand-ink"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute right-0 top-0.5 grid h-[1.1rem] min-w-[1.1rem] place-items-center rounded-full bg-brand-pink px-1 text-[0.7rem] font-bold leading-none text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="border-t border-brand-ink/10 bg-brand-ivory lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
            {MOBILE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between border-b border-brand-ink/[0.07] px-1 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors last:border-0",
                  isActive(pathname, item.href)
                    ? "text-brand-pink"
                    : "text-brand-ink hover:text-brand-pink"
                )}
              >
                {item.label}
                <span aria-hidden="true" className="text-brand-gold">
                  &rsaquo;
                </span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
