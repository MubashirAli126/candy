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
      className="w-full rounded-full bg-brand-dark px-3 py-2.5 text-sm font-bold text-white transition-all hover:bg-brand-purple disabled:cursor-not-allowed disabled:bg-gray-300 sm:px-4"
    >
      {disabled ? "Out of stock" : added ? "✓ Added!" : "Add to cart"}
    </button>
  );
}
