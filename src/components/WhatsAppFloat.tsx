"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { SITE_NAME_SHORT, STORE } from "@/lib/seo";

const WHATSAPP = STORE.whatsapp;

function waLink(text: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  const { items, totalItems } = useCart();

  const cartText =
    items.length > 0
      ? `Hi ${SITE_NAME_SHORT}! I have added these items to my cart and would like to place an order:\n\n${items
          .map(
            (i) =>
              `• ${i.name}${i.size ? ` (${i.size})` : ""} x${i.quantity}`
          )
          .join("\n")}`
      : `Hi ${SITE_NAME_SHORT}! I would like to order some dresses.`;

  const options = [
    {
      key: "cart",
      label:
        totalItems > 0
          ? `Order my cart (${totalItems} item${totalItems > 1 ? "s" : ""})`
          : "Place an order",
      subtitle: "Continue your purchase on WhatsApp",
      text: cartText,
    },
    {
      key: "custom",
      label: "Custom stitching",
      subtitle: "Get an outfit made to your measurements",
      text: `Hi ${SITE_NAME_SHORT}! I would like a custom stitched outfit. Here is what I have in mind:`,
    },
    {
      key: "query",
      label: "Ask a question",
      subtitle: "Sizes, fabric, pricing, delivery — anything",
      text: `Hi ${SITE_NAME_SHORT}! I have a question about your dresses.`,
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-5 sm:right-5">
      {open && (
        <div
          role="menu"
          aria-label="Contact us on WhatsApp"
          className="w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5"
        >
          <div className="flex items-center gap-2 bg-[#25D366] px-4 py-3 text-white">
            <WhatsAppIcon className="h-6 w-6 fill-white" />
            <div className="text-sm font-semibold leading-tight">
              Chat with us on WhatsApp
            </div>
          </div>
          <ul className="divide-y divide-gray-100">
            {options.map((o) => (
              <li key={o.key}>
                <a
                  href={waLink(o.text)}
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#25D366]/10">
                    <WhatsAppIcon className="h-4 w-4 fill-[#25D366]" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-gray-900">
                      {o.label}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {o.subtitle}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close WhatsApp menu" : "Chat with us on WhatsApp"}
        className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110"
      >
        {open ? (
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 stroke-white"
            fill="none"
            strokeWidth={2.5}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <WhatsAppIcon className="h-8 w-8 fill-white" />
        )}
        {!open && totalItems > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
            {totalItems}
          </span>
        )}
      </button>
    </div>
  );
}
