import type { Metadata } from "next";
import Link from "next/link";
import { getOrderForTracking } from "@/lib/data";
import { cn, formatPrice } from "@/lib/utils";
import SectionHeading from "@/components/SectionHeading";
import { SITE_NAME } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: `Check where your ${SITE_NAME} order has reached — enter your order number and the phone number you ordered with.`,
  alternates: { canonical: "/track-order" },
};

/** The happy path a parcel walks, in order. CANCELLED is handled separately. */
const TIMELINE = [
  { status: "PENDING", label: "Order placed" },
  { status: "CONFIRMED", label: "Confirmed" },
  { status: "PROCESSING", label: "Packing" },
  { status: "SHIPPED", label: "Shipped" },
  { status: "DELIVERED", label: "Delivered" },
] as const;

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: { order?: string; phone?: string };
}) {
  const orderNumber = searchParams.order?.trim();
  const phone = searchParams.phone?.trim();
  // Both fields are required — an order number alone must never reveal
  // somebody else's name and address.
  const searched = Boolean(orderNumber && phone);
  const order = searched
    ? await getOrderForTracking(orderNumber!, phone!)
    : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <SectionHeading
        as="h1"
        eyebrow="Order status"
        title="Track Your Order"
        subtitle="Enter the order number we sent you and the phone number the order was placed with."
      />

      {/* A plain GET form keeps this page server-rendered and shareable. */}
      <form
        method="get"
        className="mt-9 space-y-5 border border-brand-ink/10 bg-brand-cream p-6 sm:p-8"
      >
        <div>
          <label
            htmlFor="order"
            className="field-label"
          >
            Order number
          </label>
          <input
            id="order"
            name="order"
            required
            defaultValue={orderNumber ?? ""}
            placeholder="CP-2026-0042"
            className="field"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="field-label"
          >
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            required
            inputMode="tel"
            defaultValue={phone ?? ""}
            placeholder="0300-1234567"
            className="field"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          Track order
        </button>
      </form>

      {searched && !order && (
        <p className="mt-6 border border-brand-logoRed/25 bg-brand-logoRed/[0.04] p-5 text-center text-sm text-brand-ink">
          We could not find an order with those details. Check the order number
          and the phone number, or{" "}
          <Link href="/contact" className="font-semibold text-brand-pink hover:underline">
            contact us
          </Link>
          .
        </p>
      )}

      {order && <OrderSummary order={order} />}
    </div>
  );
}

type TrackedOrder = NonNullable<
  Awaited<ReturnType<typeof getOrderForTracking>>
>;

function OrderSummary({ order }: { order: TrackedOrder }) {
  const cancelled = order.status === "CANCELLED";
  const currentStep = TIMELINE.findIndex((s) => s.status === order.status);

  return (
    <section className="mt-8 border border-brand-ink/10 bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-ink/10 bg-brand-cream px-6 py-5">
        <div>
          <p className="eyebrow">Order</p>
          <p className="mt-1 font-display text-xl text-brand-ink">
            {order.orderNumber}
          </p>
        </div>
        <span
          className={cn(
            "px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em]",
            cancelled
              ? "bg-brand-logoRed text-white"
              : "bg-brand-ink text-brand-goldSoft"
          )}
        >
          {order.status}
        </span>
      </header>

      {cancelled ? (
        <p className="px-6 py-6 text-sm text-brand-inkSoft">
          This order was cancelled. If that is unexpected, please contact us and
          we will sort it out.
        </p>
      ) : (
        <ol className="flex flex-wrap gap-y-5 px-6 py-5">
          {TIMELINE.map((step, i) => {
            const done = i <= currentStep;
            return (
              <li key={step.status} className="flex min-w-[6.5rem] flex-1 flex-col items-center text-center">
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full border text-xs font-semibold",
                    done
                      ? "border-brand-ink bg-brand-ink text-brand-goldSoft"
                      : "border-brand-ink/15 text-brand-inkMuted"
                  )}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span
                  className={cn(
                    "mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em]",
                    done ? "text-brand-ink" : "text-brand-inkMuted"
                  )}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <div className="border-t border-brand-ink/10 px-6 py-6">
        <h2 className="eyebrow">Items</h2>
        <ul className="mt-4 space-y-2.5 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4">
              <span className="text-brand-ink">
                {item.productName}
                {item.size && (
                  <span className="text-brand-inkMuted"> · {item.size}</span>
                )}
                <span className="text-brand-inkMuted"> × {item.quantity}</span>
              </span>
              <span className="shrink-0 font-medium text-brand-ink">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-5 space-y-1.5 border-t border-brand-ink/10 pt-5 text-sm">
          <Row label="Subtotal" value={formatPrice(order.subtotal)} />
          <Row
            label="Delivery"
            value={order.shipping > 0 ? formatPrice(order.shipping) : "Free"}
          />
          <div className="flex items-baseline justify-between pt-2">
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-ink">
              Total
            </dt>
            <dd className="font-display text-lg text-brand-ink">
              {formatPrice(order.total)}
            </dd>
          </div>
        </dl>

        <p className="mt-5 text-xs text-brand-inkMuted">
          Delivering to {order.city}. Placed on{" "}
          {order.createdAt.toLocaleDateString("en-PK", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          .
        </p>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-brand-inkSoft">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
