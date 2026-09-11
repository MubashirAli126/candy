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

  function update<K extends keyof CheckoutForm>(
    key: K,
    value: CheckoutForm[K],
  ) {
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
            color: i.color,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error ?? "Something went wrong. Please try again.",
        );
      }

      // Build WhatsApp confirmation message
      const lines = [
        `*New Order — ${data.orderNumber}*`,
        "",
        ...items.map(
          (i) =>
            `• ${i.name}${i.colorLabel ? ` ${i.colorLabel}` : ""}${
              i.size ? ` (${i.size})` : ""
            } x${i.quantity} — ${formatPrice(lineTotal(i.price, i.quantity))}${
              bulkDiscountPercent(i.quantity) > 0
                ? ` (${bulkDiscountPercent(i.quantity)}% bulk off)`
                : ""
            }`,
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
        "_blank",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <p className="eyebrow">Thank you</p>
        <h1 className="mt-4 font-display text-3xl font-normal tracking-tight text-brand-ink sm:text-4xl">
          Order placed
        </h1>
        <div className="rule-gold mx-auto mt-5 w-20" aria-hidden="true" />
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-brand-inkSoft sm:text-base">
          Your order <strong>{success.orderNumber}</strong> has been received.
          We've opened WhatsApp so you can confirm it with us. We'll contact you
          shortly!
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/products" className="btn btn-primary">
            Continue shopping
          </Link>
          <button onClick={() => router.push("/")} className="btn btn-outline">
            Back to home
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <h1 className="font-display text-3xl font-normal tracking-tight text-brand-ink sm:text-4xl">
          Your cart is empty
        </h1>
        <div className="rule-gold mx-auto mt-5 w-20" aria-hidden="true" />
        <Link href="/products" className="btn btn-primary mt-6">
          Shop the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <header className="mb-6 border-b border-brand-ink/10 pb-6 sm:mb-9">
        <p className="eyebrow">Almost there</p>
        <h1 className="mt-3 font-display text-3xl font-normal tracking-tight text-brand-ink sm:text-4xl">
          Checkout
        </h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-3 lg:gap-6"
      >
        {/* Customer details */}
        <div className="space-y-4 lg:col-span-2">
          <div className="border border-brand-ink/10 bg-white p-5 sm:p-7">
            <h2 className="mb-5 font-display text-xl text-brand-ink">
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
                <label className="field-label">
                  Order notes (optional)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  rows={3}
                  placeholder="Any special instructions, custom text, etc."
                  className="field"
                />
              </div>
            </div>
            <p className="mt-5 border border-brand-gold/40 bg-brand-cream p-4 text-sm text-brand-inkSoft">
              💵 <strong>Cash on Delivery.</strong> After placing your order,
              WhatsApp will open so you can confirm with us directly.
            </p>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="border border-brand-ink/10 bg-brand-cream p-5 sm:p-6 lg:sticky lg:top-28">
            <h2 className="font-display text-xl text-brand-ink">
              Your order
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {items.map((i) => (
                <li
                  key={`${i.productId}-${i.size ?? ""}-${i.color ?? ""}`}
                  className="flex justify-between gap-2"
                >
                  <span className="min-w-0 break-words text-brand-inkSoft">
                    {i.name}
                    {i.colorLabel ? ` ${i.colorLabel}` : ""}
                    {i.size ? ` (${i.size})` : ""} × {i.quantity}
                  </span>
                  <span className="font-medium text-brand-ink">
                    {formatPrice(lineTotal(i.price, i.quantity))}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2.5 border-t border-brand-ink/10 pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-brand-inkSoft">Items</dt>
                <dd className="font-medium text-brand-ink">
                  {formatPrice(itemsTotal)}
                </dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-brand-plum">
                  <dt>Bulk discount ({BULK_DISCOUNT_PERCENT}%)</dt>
                  <dd className="font-semibold">− {formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-brand-inkSoft">Subtotal</dt>
                <dd className="font-medium text-brand-ink">
                  {formatPrice(subtotal)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-brand-inkSoft">Shipping</dt>
                <dd className="font-medium text-brand-ink">
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-brand-ink/10 pt-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-ink">
                  Total
                </dt>
                <dd className="font-display text-xl text-brand-ink">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>

            {error && (
              <p className="mt-4 border border-brand-logoRed/25 bg-brand-logoRed/[0.05] p-3 text-sm text-brand-logoRed">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-candy mt-6 w-full"
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
      <label className="field-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field"
      />
    </div>
  );
}
