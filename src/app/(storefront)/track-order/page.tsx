import type { Metadata } from "next";
import Link from "next/link";
import { getOrderForTracking } from "@/lib/data";
import { cn, formatPrice } from "@/lib/utils";
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
      <h1 className="text-center font-display text-2xl font-extrabold uppercase tracking-[0.14em] text-brand-dark sm:text-3xl">
        Track Your Order
      </h1>
      <p className="mx-auto mt-3 max-w-md text-center text-sm text-gray-500 sm:text-base">
        Enter the order number we sent you and the phone number the order was
        placed with.
      </p>

      {/* A plain GET form keeps this page server-rendered and shareable. */}
      <form
        method="get"
        className="mt-8 space-y-4 border border-black/5 bg-brand-mist p-5 sm:p-6"
      >
        <div>
          <label
            htmlFor="order"
            className="mb-1 block text-xs font-bold uppercase tracking-wide text-brand-dark"
          >
            Order number
          </label>
          <input
            id="order"
            name="order"
            required
            defaultValue={orderNumber ?? ""}
            placeholder="CP-2026-0042"
            className="w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand-pink"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="mb-1 block text-xs font-bold uppercase tracking-wide text-brand-dark"
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
            className="w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand-pink"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-brand-dark px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand-pink hover:text-brand-dark"
        >
          Track order
        </button>
      </form>

      {searched && !order && (
        <p className="mt-6 border border-brand-logoRed/20 bg-brand-logoRed/5 p-4 text-center text-sm text-brand-dark">
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
    <section className="mt-8 border border-black/5">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 bg-brand-mist px-5 py-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Order
          </p>
          <p className="font-display text-lg font-extrabold text-brand-dark">
            {order.orderNumber}
          </p>
        </div>
        <span
          className={cn(
            "px-3 py-1 text-xs font-bold uppercase tracking-wide",
            cancelled
              ? "bg-brand-logoRed text-white"
              : "bg-brand-pink text-brand-dark"
          )}
        >
          {order.status}
        </span>
      </header>

      {cancelled ? (
        <p className="px-5 py-5 text-sm text-gray-600">
          This order was cancelled. If that is unexpected, please contact us and
          we will sort it out.
        </p>
      ) : (
        <ol className="flex flex-wrap gap-y-4 px-5 py-5">
          {TIMELINE.map((step, i) => {
            const done = i <= currentStep;
            return (
              <li key={step.status} className="flex min-w-[6.5rem] flex-1 flex-col items-center text-center">
                <span
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-full text-xs font-bold",
                    done
                      ? "bg-brand-pink text-brand-dark"
                      : "bg-gray-100 text-gray-400"
                  )}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span
                  className={cn(
                    "mt-1.5 text-xs font-semibold",
                    done ? "text-brand-dark" : "text-gray-400"
                  )}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <div className="border-t border-black/5 px-5 py-5">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
          Items
        </h2>
        <ul className="space-y-2 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4">
              <span className="text-brand-dark">
                {item.productName}
                {item.size && (
                  <span className="text-gray-500"> · {item.size}</span>
                )}
                <span className="text-gray-500"> × {item.quantity}</span>
              </span>
              <span className="shrink-0 font-semibold text-brand-dark">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-1 border-t border-black/5 pt-4 text-sm">
          <Row label="Subtotal" value={formatPrice(order.subtotal)} />
          <Row
            label="Delivery"
            value={order.shipping > 0 ? formatPrice(order.shipping) : "Free"}
          />
          <div className="flex justify-between pt-1 text-base font-extrabold text-brand-dark">
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>

        <p className="mt-4 text-xs text-gray-500">
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
    <div className="flex justify-between text-gray-600">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
