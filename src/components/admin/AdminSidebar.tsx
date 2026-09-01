"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SITE_NAME_SHORT } from "@/lib/seo";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/products", label: "Products", icon: "🏷️" },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-black/5 bg-white px-4 py-3 lg:hidden">
        <span className="font-display font-extrabold text-brand-dark">
          {SITE_NAME_SHORT} Admin
        </span>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-xl leading-none hover:bg-black/5"
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
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 max-w-[80%] border-r border-black/5 bg-white transition-transform duration-200 ease-out lg:max-w-none lg:translate-x-0",
          open ? "translate-x-0 shadow-xl" : "-translate-x-full lg:shadow-none"
        )}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-6 flex items-start justify-between px-2 pt-2">
            <div>
              <span className="font-display text-lg font-extrabold text-brand-dark">
                ASAD
                <span className="bg-brand-gradient bg-clip-text text-transparent">
                  {" "}
                  Sticker Zone
                </span>
              </span>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="-mr-1 rounded-lg p-1.5 text-lg leading-none text-gray-400 hover:bg-black/5 lg:hidden"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

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
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                    active
                      ? "bg-brand-purple/10 text-brand-purple"
                      : "text-brand-dark/70 hover:bg-black/5"
                  )}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-black/5 pt-4">
            <Link
              href="/"
              className="mb-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-brand-dark/70 hover:bg-black/5"
            >
              🏠 View store
            </Link>
            <p className="truncate px-3 text-xs text-gray-400">{email}</p>
            <button
              onClick={logout}
              className="mt-2 w-full rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-brand-dark hover:bg-gray-200"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
