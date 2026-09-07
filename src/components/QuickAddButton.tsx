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
      className="w-full border border-brand-dark bg-brand-dark px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-brand-pink hover:bg-brand-pink hover:text-brand-dark disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300 disabled:text-white sm:px-4"
    >
      {disabled ? "Sold out" : added ? "✓ Added!" : "Add to cart"}
    </button>
  );
}
