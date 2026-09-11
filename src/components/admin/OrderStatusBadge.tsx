import type { OrderStatus } from "@/lib/types";

/**
 * Status chips in the "modern classic" palette: a tinted paper ground with a
 * hairline of the same hue, rather than the old saturated pills. Hue still
 * carries the meaning — progress warms from sand through to green, cancelled
 * is the logo red — but nothing shouts over the ink-and-gold page.
 */
const STYLES: Record<OrderStatus, string> = {
  PENDING: "border-brand-gold/50 bg-brand-goldSoft/25 text-[#7A6124]",
  CONFIRMED: "border-brand-purple/30 bg-brand-purple/[0.07] text-brand-purple",
  PROCESSING: "border-brand-pink/35 bg-brand-blush/40 text-brand-copper",
  SHIPPED: "border-brand-plum/30 bg-brand-plum/[0.07] text-brand-plum",
  DELIVERED: "border-brand-logoGreen/40 bg-brand-logoGreen/[0.08] text-[#177A35]",
  CANCELLED: "border-brand-logoRed/35 bg-brand-logoRed/[0.06] text-brand-logoRed",
};

export default function OrderStatusBadge({ status }: { status: string }) {
  const style =
    STYLES[status as OrderStatus] ??
    "border-brand-ink/15 bg-brand-sand text-brand-inkSoft";
  return (
    <span
      className={`inline-block border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] ${style}`}
    >
      {status}
    </span>
  );
}
