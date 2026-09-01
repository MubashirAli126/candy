import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import OrderStatusControl from "@/components/admin/OrderStatusControl";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div>
      <Link
        href="/admin/orders"
        className="text-sm font-semibold text-brand-purple hover:underline"
      >
        ← Back to orders
      </Link>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-extrabold text-brand-dark sm:text-3xl">
          {order.orderNumber}
        </h1>
        <OrderStatusControl orderId={order.id} current={order.status} />
      </div>
      <p className="mt-1 text-gray-500">
        Placed on {order.createdAt.toLocaleString("en-PK")}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card">
            <h2 className="border-b border-black/5 px-5 py-4 font-display font-bold text-brand-dark">
              Items
            </h2>
            <table className="w-full text-sm">
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-black/5 last:border-0">
                    <td className="px-5 py-3">
                      <div className="font-semibold text-brand-dark">
                        {item.productName}
                      </div>
                      {item.size && (
                        <div className="text-xs text-gray-500">
                          Size: {item.size}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center text-gray-500">
                      × {item.quantity}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <dl className="space-y-1 border-t border-black/5 px-5 py-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Subtotal</dt>
                <dd>{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Shipping</dt>
                <dd>{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-black/5 pt-2 text-base font-bold text-brand-dark">
                <dt>Total</dt>
                <dd>{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Customer */}
        <div>
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-card">
            <h2 className="mb-3 font-display font-bold text-brand-dark">
              Customer
            </h2>
            <dl className="space-y-2 text-sm">
              <Info label="Name" value={order.customerName} />
              <Info label="Phone" value={order.phone} />
              {order.email && <Info label="Email" value={order.email} />}
              <Info label="Address" value={order.address} />
              <Info label="City" value={order.city} />
              {order.notes && <Info label="Notes" value={order.notes} />}
            </dl>
            <a
              href={`https://wa.me/${order.phone.replace(/[^0-9]/g, "").replace(/^0/, "92")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block rounded-full bg-[#25D366] px-4 py-2.5 text-center text-sm font-bold text-white"
            >
              📱 WhatsApp customer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="text-brand-dark">{value}</dd>
    </div>
  );
}
