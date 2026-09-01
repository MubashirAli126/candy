"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import type { CartItem } from "@/lib/types";
import { cartTotals } from "@/lib/pricing";

const STORAGE_KEY = "asad_sticker_zone_cart";
/** Pre-rebrand key — read once so existing shoppers don't lose their cart. */
const LEGACY_STORAGE_KEY = "chammak_patti_cart";

type CartState = { items: CartItem[] };

type Action =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; productId: string; size?: string }
  | { type: "SET_QTY"; productId: string; size?: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

function sameLine(a: CartItem, productId: string, size?: string) {
  return a.productId === productId && (a.size ?? "") === (size ?? "");
}

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.items };
    case "ADD": {
      const existing = state.items.find((i) =>
        sameLine(i, action.item.productId, action.item.size)
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            sameLine(i, action.item.productId, action.item.size)
              ? {
                  ...i,
                  quantity: Math.min(
                    i.quantity + action.item.quantity,
                    i.stock || 99
                  ),
                }
              : i
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case "REMOVE":
      return {
        items: state.items.filter(
          (i) => !sameLine(i, action.productId, action.size)
        ),
      };
    case "SET_QTY":
      return {
        items: state.items
          .map((i) =>
            sameLine(i, action.productId, action.size)
              ? { ...i, quantity: Math.max(1, action.quantity) }
              : i
          )
          .filter((i) => i.quantity > 0),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size?: string) => void;
  setQuantity: (productId: string, quantity: number, size?: string) => void;
  clear: () => void;
  totalItems: number;
  /** Line prices summed before any bulk discount. */
  itemsTotal: number;
  /** Bulk discount earned across all lines. */
  discount: number;
  /** itemsTotal − discount: what the items actually cost. */
  subtotal: number;
  shipping: number;
  total: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  // Lightweight "added to cart" toast — gives visible feedback anywhere,
  // even when the header cart badge is scrolled out of view (mobile).
  const [toast, setToast] = useState<{ key: number; name: string } | null>(
    null
  );

  // Auto-dismiss the toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      // Fall back to the pre-rebrand key, then retire it so the migration
      // only ever happens once per browser.
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      const raw = localStorage.getItem(STORAGE_KEY) ?? legacy;
      if (legacy) localStorage.removeItem(LEGACY_STORAGE_KEY);
      if (raw) {
        const items = JSON.parse(raw) as CartItem[];
        if (Array.isArray(items)) dispatch({ type: "HYDRATE", items });
      }
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      /* storage may be unavailable */
    }
  }, [state.items]);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
    const totals = cartTotals(state.items);
    return {
      items: state.items,
      addItem: (item) => {
        dispatch({ type: "ADD", item });
        setToast({ key: Date.now(), name: item.name });
      },
      removeItem: (productId, size) =>
        dispatch({ type: "REMOVE", productId, size }),
      setQuantity: (productId, quantity, size) =>
        dispatch({ type: "SET_QTY", productId, quantity, size }),
      clear: () => dispatch({ type: "CLEAR" }),
      totalItems,
      ...totals,
    };
  }, [state.items]);

  return (
    <CartContext.Provider value={value}>
      {children}

      {/* Add-to-cart toast */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 sm:bottom-6 sm:left-6 sm:right-auto sm:justify-start"
      >
        {toast && (
          <div
            key={toast.key}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl bg-brand-dark px-4 py-3 text-white shadow-xl ring-1 ring-white/10 motion-safe:animate-[toast-in_0.25s_ease-out]"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-gradient text-brand-dark">
              ✓
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-tight">
                Added to cart
              </p>
              <p className="truncate text-xs text-white/60">{toast.name}</p>
            </div>
            <Link
              href="/cart"
              className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-brand-yellow transition-colors hover:bg-white/20"
            >
              View cart
            </Link>
          </div>
        )}
      </div>
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
