"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SITE_NAME_SHORT } from "@/lib/seo";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/products", label: "Products", icon: "🏷️" },
  { href: "/admin/slides", label: "Homepage slider", icon: "🖼️" },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // A back/forward navigation changes the route without a link click, which
  // would otherwise leave the drawer sitting open over the new page.
  useEffect(() => setOpen(false), [pathname]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-brand-ink/10 bg-brand-ivory/90 px-4 py-3 backdrop-blur-md lg:hidden">
        <span className="font-display text-lg text-brand-ink">
          {SITE_NAME_SHORT}{" "}
          <span className="text-sm uppercase tracking-[0.2em] text-brand-gold">
            Admin
          </span>
        </span>
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-sm text-lg leading-none text-brand-ink transition-colors hover:bg-brand-sand"
          aria-label="Open menu"
          aria-expanded={open}
        >
          ☰
        </button>
      </div>

      {/* Backdrop (mobile only, when drawer is open) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-brand-night/50 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 max-w-[80%] border-r border-brand-ink/10 bg-brand-cream transition-transform duration-200 ease-out lg:max-w-none lg:translate-x-0",
          open ? "translate-x-0 shadow-lift" : "-translate-x-full lg:shadow-none"
        )}
      >
        <div className="flex h-full flex-col p-5">
          <div className="mb-7 flex items-start justify-between pt-1">
            <div>
              <p className="eyebrow">Admin panel</p>
              <span className="mt-2 block font-display text-xl leading-tight text-brand-ink">
                CANDY
                <span className="block text-sm italic text-brand-gold">
                  Ladies Clothing
                </span>
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="-mr-1 rounded-sm p-1.5 text-lg leading-none text-brand-inkMuted transition-colors hover:bg-brand-sand hover:text-brand-ink lg:hidden"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <div className="rule-gold mb-5" aria-hidden="true" />

          <nav className="flex-1 space-y-1">
            {LINKS.map((link) => {
              const active =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    // The active row is a solid ink plate with a gold label —
                    // the same pairing the storefront uses for its dark chips.
                    "flex items-center gap-3 rounded-sm px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
                    active
                      ? "bg-brand-ink text-brand-goldSoft"
                      : "text-brand-inkSoft hover:bg-brand-sand hover:text-brand-ink"
                  )}
                >
                  <span aria-hidden="true" className="text-sm">
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-brand-ink/10 pt-4">
            <Link
              href="/"
              className="mb-3 flex items-center gap-2 rounded-sm px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-inkSoft transition-colors hover:bg-brand-sand hover:text-brand-ink"
            >
              <span aria-hidden="true">🏠</span> View store
            </Link>
            <p className="truncate px-3 text-xs text-brand-inkMuted">{email}</p>
            <button
              onClick={logout}
              className="btn btn-outline btn-sm mt-3 w-full"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
