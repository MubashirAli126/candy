"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import {
  BULK_DISCOUNT_PERCENT,
  bulkDiscountPercent,
  lineTotal,
} from "@/lib/pricing";
import type { CheckoutForm } from "@/lib/types";
import { STORE } from "@/lib/seo";

const WHATSAPP = STORE.whatsapp;

export default function CheckoutPage() {
  const { items, itemsTotal, discount, subtotal, shipping, total, clear } =
    useCart();
  const router = useRouter();

  const [form, setForm] = useState<CheckoutForm>({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ orderNumber: string } | null>(null);

  function update<K extends keyof CheckoutForm>(key: K, value: CheckoutForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!form.customerName || !form.phone || !form.address || !form.city) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            size: i.size,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      // Build WhatsApp confirmation message
      const lines = [
        `*New Order — ${data.orderNumber}*`,
        "",
        ...items.map(
          (i) =>
            `• ${i.name}${i.size ? ` (${i.size})` : ""} x${i.quantity} — ${formatPrice(
              lineTotal(i.price, i.quantity)
            )}${
              bulkDiscountPercent(i.quantity) > 0
                ? ` (${bulkDiscountPercent(i.quantity)}% bulk off)`
                : ""
            }`
        ),
        "",
        `Items: ${formatPrice(itemsTotal)}`,
        discount > 0
          ? `Bulk discount (${BULK_DISCOUNT_PERCENT}%): -${formatPrice(discount)}`
          : "",
        `Subtotal: ${formatPrice(subtotal)}`,
        `Shipping: ${shipping === 0 ? "FREE" : formatPrice(shipping)}`,
        `*Total: ${formatPrice(total)}*`,
        "",
        `Name: ${form.customerName}`,
        `Phone: ${form.phone}`,
        `Address: ${form.address}, ${form.city}`,
        form.notes ? `Notes: ${form.notes}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      clear();
      setSuccess({ orderNumber: data.orderNumber });

      // Open WhatsApp with prefilled order
      window.open(
        `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines)}`,
        "_blank"
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <div className="text-6xl">🎉</div>
        <h1 className="mt-4 font-display text-3xl font-extrabold text-brand-dark">
          Order placed!
        </h1>
        <p className="mt-2 text-gray-600">
          Your order <strong>{success.orderNumber}</strong> has been received.
          We've opened WhatsApp so you can confirm it with us. We'll contact you
          shortly!
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/products"
            className="rounded-full bg-brand-gradient px-7 py-3.5 font-bold text-brand-dark shadow-brand"
          >
            Continue shopping
          </Link>
          <button
            onClick={() => router.push("/")}
            className="rounded-full border border-brand-dark/15 px-7 py-3.5 font-bold text-brand-dark"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <h1 className="font-display text-2xl font-extrabold text-brand-dark">
          Your cart is empty
        </h1>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-brand-gradient px-7 py-3.5 font-bold text-brand-dark shadow-brand"
        >
          Shop dresses
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <h1 className="mb-6 font-display text-2xl font-extrabold text-brand-dark sm:mb-8 sm:text-4xl">
        Checkout
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Customer details */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
            <h2 className="mb-4 font-display text-xl font-bold text-brand-dark">
              Delivery details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Full name *"
                value={form.customerName}
                onChange={(v) => update("customerName", v)}
                placeholder="Ali Khan"
              />
              <Field
                label="Phone number *"
                value={form.phone}
                onChange={(v) => update("phone", v)}
                placeholder="03001234567"
                type="tel"
              />
              <Field
                label="Email (optional)"
                value={form.email ?? ""}
                onChange={(v) => update("email", v)}
                placeholder="you@example.com"
                type="email"
                className="sm:col-span-2"
              />
              <Field
                label="Address *"
                value={form.address}
                onChange={(v) => update("address", v)}
                placeholder="House / Street / Area"
                className="sm:col-span-2"
              />
              <Field
                label="City *"
                value={form.city}
                onChange={(v) => update("city", v)}
                placeholder="Karachi"
              />
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-brand-dark">
                  Order notes (optional)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  rows={3}
                  placeholder="Any special instructions, custom text, etc."
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-brand-purple"
                />
              </div>
            </div>
            <p className="mt-4 rounded-xl bg-brand-yellow/10 p-3 text-sm text-brand-dark">
              💵 <strong>Cash on Delivery.</strong> After placing your order,
              WhatsApp will open so you can confirm with us directly.
            </p>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-black/5 bg-white p-6 shadow-card">
            <h2 className="font-display text-xl font-bold text-brand-dark">
              Your order
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {items.map((i) => (
                <li
                  key={`${i.productId}-${i.size ?? ""}`}
                  className="flex justify-between gap-2"
                >
                  <span className="text-gray-600">
                    {i.name}
                    {i.size ? ` (${i.size})` : ""} × {i.quantity}
                  </span>
                  <span className="font-semibold">
                    {formatPrice(lineTotal(i.price, i.quantity))}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-black/5 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Items</dt>
                <dd className="font-semibold">{formatPrice(itemsTotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <dt>Bulk discount ({BULK_DISCOUNT_PERCENT}%)</dt>
                  <dd className="font-semibold">− {formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-500">Subtotal</dt>
                <dd className="font-semibold">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Shipping</dt>
                <dd className="font-semibold">
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-black/5 pt-2 text-base">
                <dt className="font-bold text-brand-dark">Total</dt>
                <dd className="font-extrabold text-brand-dark">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>

            {error && (
              <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-full bg-brand-gradient px-6 py-3.5 font-bold text-brand-dark shadow-brand transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {submitting ? "Placing order..." : "Place order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-semibold text-brand-dark">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-brand-purple"
      />
    </div>
  );
}
