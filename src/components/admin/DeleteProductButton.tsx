"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      alert("Failed to delete product.");
      setDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-lg px-3 py-1.5 text-sm font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
    >
      {deleting ? "..." : "Delete"}
    </button>
  );
}
