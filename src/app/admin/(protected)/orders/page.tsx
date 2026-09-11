import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });

  return (
    <div>
      <AdminPageHeader
        eyebrow="Orders"
        title="Orders"
        subtitle={`${orders.length} total ${orders.length === 1 ? "order" : "orders"}.`}
      />

      {orders.length === 0 ? (
        <p className="border border-brand-ink/10 bg-white p-10 text-center text-sm text-brand-inkSoft">
          No orders yet.
        </p>
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="space-y-3 md:hidden">
            {orders.map((o) => (
              <Link
                key={o.id}
                href={`/admin/orders/${o.id}`}
                className="card card-hover block p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-display text-lg text-brand-ink">
                      {o.orderNumber}
                    </span>
                    <p className="truncate text-sm text-brand-ink">
                      {o.customerName}
                    </p>
                    <p className="truncate text-xs text-brand-inkMuted">
                      {o.phone}
                    </p>
                  </div>
                  <OrderStatusBadge status={o.status} />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-brand-ink/10 pt-3 text-sm">
                  <span className="text-brand-inkSoft">
                    {o._count.items} item{o._count.items === 1 ? "" : "s"}
                    <span className="mx-1.5 text-brand-gold">·</span>
                    {o.createdAt.toLocaleDateString("en-PK")}
                  </span>
                  <span className="font-semibold text-brand-ink">
                    {formatPrice(o.total)}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="table-shell hidden md:block">
            <table className="w-full text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3.5">Order</th>
                  <th className="px-4 py-3.5">Customer</th>
                  <th className="hidden px-4 py-3.5 md:table-cell">Phone</th>
                  <th className="hidden px-4 py-3.5 sm:table-cell">Items</th>
                  <th className="px-4 py-3.5">Total</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="hidden px-4 py-3.5 lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="table-row">
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="link-underline font-semibold text-brand-ink"
                      >
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-brand-ink">
                      {o.customerName}
                    </td>
                    <td className="hidden px-4 py-3.5 text-brand-inkSoft md:table-cell">
                      {o.phone}
                    </td>
                    <td className="hidden px-4 py-3.5 text-brand-inkSoft sm:table-cell">
                      {o._count.items}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-brand-ink">
                      {formatPrice(o.total)}
                    </td>
                    <td className="px-4 py-3.5">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="hidden px-4 py-3.5 text-brand-inkSoft lg:table-cell">
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
