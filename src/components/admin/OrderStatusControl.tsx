"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUSES } from "@/lib/types";

export default function OrderStatusControl({
  orderId,
  current,
}: {
  orderId: string;
  current: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  const [saving, setSaving] = useState(false);

  async function onChange(next: string) {
    setStatus(next);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setStatus(current); // revert on failure
      alert("Failed to update status.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <label className="flex items-center gap-2">
      <span className="text-sm font-semibold text-gray-500">Status:</span>
      <select
        value={status}
        onChange={(e) => onChange(e.target.value)}
        disabled={saving}
        className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-base font-bold text-brand-dark outline-none focus:border-brand-purple disabled:opacity-60 sm:w-auto sm:text-sm"
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </label>
  );
}
