"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { galleryForColor, type ColorVariant } from "@/lib/colors";

interface ProductColorValue {
  variants: ColorVariant[];
  /** Empty string until the shopper picks a colour. */
  selected: string;
  select: (label: string) => void;
  /** Pictures for the current colour, falling back to the shared gallery. */
  images: string[];
}

const ProductColorContext = createContext<ProductColorValue | null>(null);

/**
 * Shares the chosen colour between the gallery and the add-to-cart form, which
 * sit in different columns of the product page. Wrapping them in this provider
 * keeps everything between the two (headings, price, description) server
 * rendered — only the two pieces that care about the colour are client side.
 */
export function ProductColorProvider({
  variants,
  productImages,
  children,
}: {
  variants: ColorVariant[];
  /** The design's shared gallery, used for colours with no pictures of their own. */
  productImages: string[];
  children: ReactNode;
}) {
  // Preselect the first colour: with variants present the shopper is always
  // looking at one particular colour, so the cart is never left guessing.
  const [selected, setSelected] = useState(variants[0]?.label ?? "");

  const value = useMemo<ProductColorValue>(
    () => ({
      variants,
      selected,
      select: setSelected,
      images: galleryForColor(variants, selected, productImages),
    }),
    [variants, selected, productImages],
  );

  return (
    <ProductColorContext.Provider value={value}>
      {children}
    </ProductColorContext.Provider>
  );
}

/**
 * The product's colour state, or null when the page has no colour variants —
 * callers then behave exactly as they did before colours existed.
 */
export function useProductColor(): ProductColorValue | null {
  return useContext(ProductColorContext);
}
