import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [orderCount, pendingCount, productCount, revenue, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.product.count({ where: { active: true } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELLED" } },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { _count: { select: { items: true } } },
      }),
    ]);

  const stats = [
    { label: "Total Orders", value: orderCount, href: "/admin/orders" },
    { label: "Pending Orders", value: pendingCount, href: "/admin/orders" },
    { label: "Active Products", value: productCount, href: "/admin/products" },
    {
      label: "Revenue",
      value: formatPrice(revenue._sum.total ?? 0),
      href: "/admin/orders",
    },
  ];

  return (
    <div>
      <AdminPageHeader
        eyebrow="Overview"
        title="Dashboard"
        subtitle="Welcome back — here is your store at a glance."
      />

      {/* Typeset rather than illustrated: a numeral, a serif figure and a
          hairline, matching the storefront's assurance strip. */}
      <div className="grid gap-px bg-brand-ink/10 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Link
            key={s.label}
            href={s.href}
            className="group bg-white px-5 py-6 transition-colors hover:bg-brand-cream"
          >
            <span className="font-display text-sm italic text-brand-gold">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="mt-2 font-display text-3xl leading-none text-brand-ink">
              {s.value}
            </div>
            <div className="mt-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-inkMuted">
              {s.label}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Latest activity</p>
            <h2 className="mt-2 font-display text-2xl text-brand-ink">
              Recent Orders
            </h2>
          </div>
          <Link
            href="/admin/orders"
            className="link-underline text-xs font-semibold uppercase tracking-[0.16em] text-brand-inkSoft transition-colors hover:text-brand-ink"
          >
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="border border-brand-ink/10 bg-white p-10 text-center text-sm text-brand-inkSoft">
            No orders yet.
          </p>
        ) : (
          <div className="table-shell">
            <table className="w-full min-w-[420px] text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3.5">Order</th>
                  <th className="px-4 py-3.5">Customer</th>
                  <th className="hidden px-4 py-3.5 sm:table-cell">Items</th>
                  <th className="px-4 py-3.5">Total</th>
                  <th className="px-4 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
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
                    <td className="hidden px-4 py-3.5 text-brand-inkSoft sm:table-cell">
                      {o._count.items}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-brand-ink">
                      {formatPrice(o.total)}
                    </td>
                    <td className="px-4 py-3.5">
                      <OrderStatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
