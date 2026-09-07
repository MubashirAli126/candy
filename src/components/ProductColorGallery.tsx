"use client";

import ProductGallery from "./ProductGallery";
import { useProductColor } from "@/context/ProductColorContext";

/**
 * The product gallery, following the colour the shopper picked. Kept separate so
 * ProductGallery itself stays a plain media viewer that knows nothing about
 * colours.
 */
export default function ProductColorGallery({
  images,
  video,
  name,
  discount = 0,
}: {
  /** The design's shared gallery — used until a colour with pictures is picked. */
  images: string[];
  video?: string | null;
  name: string;
  discount?: number;
}) {
  const color = useProductColor();
  const shown = color?.images.length ? color.images : images;

  return (
    <ProductGallery
      // Remount on a colour change so the swipe track starts at the first
      // picture of the new colour instead of keeping the old scroll position.
      key={color?.selected ?? ""}
      images={shown}
      video={video}
      name={color?.selected ? `${name} — ${color.selected}` : name}
      discount={discount}
    />
  );
}
