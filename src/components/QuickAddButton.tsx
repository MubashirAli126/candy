"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface Props {
  product: {
    productId: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
  disabled?: boolean;
}

export default function QuickAddButton({ product, disabled }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (disabled) return;
    addItem({ ...product, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={disabled}
      className={
        added
          ? "btn btn-sm btn-candy w-full"
          : "btn btn-sm btn-outline w-full disabled:border-brand-ink/15 disabled:text-brand-inkMuted"
      }
    >
      {disabled ? "Sold out" : added ? "✓ Added" : "Add to cart"}
    </button>
  );
}
