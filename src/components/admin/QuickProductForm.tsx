"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MediaUploader from "./MediaUploader";
import ProductTypePicker from "./ProductTypePicker";
import SizePriceEditor from "./SizePriceEditor";
import ColorPicturesField from "./ColorPicturesField";
import type { ProductType } from "@/lib/types";
import { serializeSizeOptions, type SizeOption } from "@/lib/sizes";
import { serializeColorImages } from "@/lib/colors";

/**
 * Minimal "Add product" form — only the things an admin must decide:
 * name, product type, price, sizes (each with its own price) and a picture.
 * Everything else (description, category, stock, tags, flags) is auto-filled
 * server-side.
 */
export default function QuickProductForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState<SizeOption[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [productType, setProductType] = useState<ProductType>("THREE_PIECE");
  const [customType, setCustomType] = useState("");

  const [uploading, setUploading] = useState(false);
  const [colorUploading, setColorUploading] = useState(false);
  // Either uploader still working means the payload would miss a picture.
  const mediaBusy = uploading || colorUploading;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Please enter a product name.");
    if (productType === "OTHER" && !customType.trim()) {
      return setError("Please type what kind of item this is.");
    }
    const serializedSizes = serializeSizeOptions(sizes);
    if (!serializedSizes) return setError("Please enter at least one size.");
    if (Number(price) <= 0) return setError("Price must be greater than 0.");
    if (images.length === 0)
      return setError("Please upload at least one picture.");

    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          price: Number(price),
          size: serializedSizes,
          colors: serializeColorImages(colors),
          images,
          productType,
          customType: productType === "OTHER" ? customType.trim() : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl space-y-5 rounded-2xl border border-black/5 bg-white p-6 shadow-card sm:p-8"
    >
      {/* Name */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-brand-dark">
          Product name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Racing Stripe Decal"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-brand-purple"
        />
      </div>

      {/* Product type */}
      <ProductTypePicker
        value={productType}
        onChange={setProductType}
        customType={customType}
        onCustomTypeChange={setCustomType}
      />

      {/* Price — charged for any size the admin didn't price separately. */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-brand-dark">
          Price (PKR)
        </label>
        <input
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g. 1200"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-brand-purple"
        />
      </div>

      {/* Sizes, each with its own price */}
      <SizePriceEditor
        value={sizes}
        onChange={setSizes}
        basePrice={Number(price) || undefined}
      />

      {/* Pictures */}
      <MediaUploader
        images={images}
        onImagesChange={setImages}
        onUploadingChange={setUploading}
        onError={setError}
      />

      <div className="border-t border-black/5 pt-5">
        <ColorPicturesField
          images={colors}
          onChange={setColors}
          onUploadingChange={setColorUploading}
          onError={setError}
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <p className="text-xs text-gray-400">
        Description, category and stock are set automatically — you can
        fine-tune them later by editing the product.
      </p>

      <button
        type="submit"
        disabled={saving || mediaBusy}
        className="w-full rounded-full bg-brand-gradient px-6 py-3.5 font-bold text-brand-dark shadow-brand disabled:opacity-60"
      >
        {mediaBusy
          ? "Uploading pictures..."
          : saving
            ? "Saving..."
            : "Add product"}
      </button>
    </form>
  );
}
