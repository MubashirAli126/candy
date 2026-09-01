import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-dark sm:text-3xl">
        Orders
      </h1>
      <p className="mt-1 text-gray-500">{orders.length} total orders</p>

      {orders.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-white p-10 text-center text-gray-500 shadow-card">
          No orders yet.
        </p>
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="mt-6 space-y-3 md:hidden">
            {orders.map((o) => (
              <Link
                key={o.id}
                href={`/admin/orders/${o.id}`}
                className="block rounded-2xl border border-black/5 bg-white p-4 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-semibold text-brand-purple">
                      {o.orderNumber}
                    </span>
                    <p className="truncate text-sm text-brand-dark">
                      {o.customerName}
                    </p>
                    <p className="truncate text-xs text-gray-500">{o.phone}</p>
                  </div>
                  <OrderStatusBadge status={o.status} />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-3 text-sm">
                  <span className="text-gray-500">
                    {o._count.items} item{o._count.items === 1 ? "" : "s"}
                    <span className="mx-1.5">·</span>
                    {o.createdAt.toLocaleDateString("en-PK")}
                  </span>
                  <span className="font-semibold">{formatPrice(o.total)}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-card md:block">
          <table className="w-full text-sm">
            <thead className="border-b border-black/5 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="hidden px-4 py-3 md:table-cell">Phone</th>
                <th className="hidden px-4 py-3 sm:table-cell">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="hidden px-4 py-3 lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="font-semibold text-brand-purple hover:underline"
                    >
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-brand-dark">{o.customerName}</td>
                  <td className="hidden px-4 py-3 text-gray-500 md:table-cell">
                    {o.phone}
                  </td>
                  <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">
                    {o._count.items}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {formatPrice(o.total)}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="hidden px-4 py-3 text-gray-500 lg:table-cell">
                    {o.createdAt.toLocaleDateString("en-PK")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}
    </div>
  );
}
