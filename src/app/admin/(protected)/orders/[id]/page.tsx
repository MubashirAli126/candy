import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import OrderStatusControl from "@/components/admin/OrderStatusControl";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminBackLink from "@/components/admin/AdminBackLink";

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
      <AdminPageHeader
        back={<AdminBackLink href="/admin/orders">Back to orders</AdminBackLink>}
        eyebrow="Order"
        title={order.orderNumber}
        subtitle={`Placed on ${order.createdAt.toLocaleString("en-PK")}`}
        actions={
          <OrderStatusControl orderId={order.id} current={order.status} />
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <h2 className="border-b border-brand-ink/10 bg-brand-cream px-5 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-inkMuted">
              Items
            </h2>
            <table className="w-full text-sm">
              <tbody>
                {order.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-brand-ink/[0.07] last:border-0"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-brand-ink">
                        {item.productName}
                      </div>
                      {item.size && (
                        <div className="mt-0.5 text-xs text-brand-inkSoft">
                          Size: {item.size}
                        </div>
                      )}
                      {/* Colours are pictures, not names — show the one that
                          was ordered so it can be packed without guesswork. */}
                      {item.color && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="relative h-10 w-10 overflow-hidden rounded-sm border border-brand-ink/10 bg-brand-cream">
                            <Image
                              src={item.color}
                              alt="Colour ordered"
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </span>
                          <span className="text-xs text-brand-inkMuted">
                            Colour ordered
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center text-brand-inkSoft">
                      × {item.quantity}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-brand-ink">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <dl className="space-y-1.5 border-t border-brand-ink/10 bg-brand-cream px-5 py-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-brand-inkSoft">Subtotal</dt>
                <dd className="text-brand-ink">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-brand-inkSoft">Shipping</dt>
                <dd className="text-brand-ink">
                  {order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-brand-ink/10 pt-2.5">
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-inkMuted">
                  Total
                </dt>
                <dd className="font-display text-xl text-brand-ink">
                  {formatPrice(order.total)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Customer */}
        <div>
          <div className="card p-5">
            <h2 className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-inkMuted">
              Customer
            </h2>
            <div className="rule-hairline my-4" aria-hidden="true" />
            <dl className="space-y-3 text-sm">
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
              className="btn btn-sm mt-5 w-full bg-[#25D366] text-white transition-all hover:-translate-y-px hover:brightness-95"
            >
              WhatsApp customer
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
      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-inkMuted">
        {label}
      </dt>
      <dd className="mt-0.5 text-brand-ink">{value}</dd>
    </div>
  );
}
