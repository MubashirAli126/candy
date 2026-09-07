"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { colorLabelFor, galleryForColor } from "@/lib/colors";

interface ProductColorValue {
  /** One picture per other colour the design comes in. */
  colors: string[];
  /** The picked colour's picture; empty until the shopper picks one. */
  selected: string;
  select: (image: string) => void;
  /** "Colour 2" — for the cart, the order and the WhatsApp message. */
  selectedLabel: string;
  /** Gallery for the current colour, falling back to the design's pictures. */
  images: string[];
}

const ProductColorContext = createContext<ProductColorValue | null>(null);

/**
 * Shares the picked colour between the gallery and the add-to-cart form, which
 * sit in different columns of the product page. Wrapping them in this provider
 * keeps everything between the two (headings, price, description) server
 * rendered — only the two pieces that care about the colour are client side.
 */
export function ProductColorProvider({
  colors,
  productImages,
  children,
}: {
  /** One picture per other colour the design comes in. */
  colors: string[];
  /** The design's own gallery, shown until another colour is picked. */
  productImages: string[];
  children: ReactNode;
}) {
  // Nothing is preselected: the design's own pictures are a colour in their own
  // right, so the shopper only picks when they want a different one.
  const [selected, setSelected] = useState("");

  const value = useMemo<ProductColorValue>(
    () => ({
      colors,
      selected,
      select: setSelected,
      selectedLabel: colorLabelFor(colors, selected) ?? "",
      images: galleryForColor(colors, selected, productImages),
    }),
    [colors, selected, productImages],
  );

  return (
    <ProductColorContext.Provider value={value}>
      {children}
    </ProductColorContext.Provider>
  );
}

/**
 * The product's colour state, or null when the design has no other colours —
 * callers then behave exactly as they did before colours existed.
 */
export function useProductColor(): ProductColorValue | null {
  return useContext(ProductColorContext);
}
