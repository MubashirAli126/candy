import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";

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
    { label: "Total Orders", value: orderCount, icon: "📦", href: "/admin/orders" },
    { label: "Pending Orders", value: pendingCount, icon: "⏳", href: "/admin/orders" },
    { label: "Active Products", value: productCount, icon: "🏷️", href: "/admin/products" },
    {
      label: "Revenue",
      value: formatPrice(revenue._sum.total ?? 0),
      icon: "💰",
      href: "/admin/orders",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-dark sm:text-3xl">
        Dashboard
      </h1>
      <p className="mt-1 text-gray-500">Welcome back! Here's your store at a glance.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-black/5 bg-white p-5 shadow-card transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{s.icon}</span>
            </div>
            <div className="mt-3 font-display text-2xl font-extrabold text-brand-dark">
              {s.value}
            </div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-brand-dark">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-brand-purple hover:underline"
          >
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-card">
            No orders yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-card">
            <table className="w-full min-w-[420px] text-sm">
              <thead className="border-b border-black/5 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
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
                    <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">
                      {o._count.items}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {formatPrice(o.total)}
                    </td>
                    <td className="px-4 py-3">
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
