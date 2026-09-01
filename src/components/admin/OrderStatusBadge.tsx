import type { OrderStatus } from "@/lib/types";

const STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-indigo-100 text-indigo-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function OrderStatusBadge({ status }: { status: string }) {
  const style = STYLES[status as OrderStatus] ?? "bg-gray-100 text-gray-700";
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${style}`}
    >
      {status}
    </span>
  );
}
