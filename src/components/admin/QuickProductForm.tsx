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
 * A description can be typed here but is optional; left blank, it — along with
 * category, stock, tags and flags — is auto-filled server-side.
 */
export default function QuickProductForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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
    const trimmedDescription = description.trim();
    if (trimmedDescription && trimmedDescription.length < 5) {
      return setError("Description is too short — write at least 5 characters.");
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
          // Blank means "let the server write one" — sending "" would fail
          // the API's min-length check.
          ...(trimmedDescription ? { description: trimmedDescription } : {}),
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
      className="card mx-auto max-w-xl space-y-6 p-6 sm:p-8"
    >
      {/* Name */}
      <div>
        <label className="field-label">Product name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Embroidered Lawn 3 Piece"
          className="field"
        />
      </div>

      {/* Product type */}
      <ProductTypePicker
        value={productType}
        onChange={setProductType}
        customType={customType}
        onCustomTypeChange={setCustomType}
      />

      {/* Description — optional, auto-written server-side when left blank. */}
      <div>
        <label className="field-label">
          Description{" "}
          <span className="normal-case tracking-normal text-brand-inkMuted">
            (optional)
          </span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Tell customers about the fabric, work and fit. Leave this blank and one is written for you."
          className="field"
        />
      </div>

      {/* Price — charged for any size the admin didn't price separately. */}
      <div>
        <label className="field-label">Price (PKR)</label>
        <input
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g. 1200"
          className="field"
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

      <div className="border-t border-brand-ink/10 pt-6">
        <ColorPicturesField
          images={colors}
          onChange={setColors}
          onUploadingChange={setColorUploading}
          onError={setError}
        />
      </div>

      {error && (
        <p className="border border-brand-logoRed/25 bg-brand-logoRed/[0.04] p-4 text-sm text-brand-ink">
          {error}
        </p>
      )}

      <p className="text-xs leading-relaxed text-brand-inkMuted">
        Category and stock — plus the description, if you left it blank — are
        set automatically. You can fine-tune them later by editing the product.
      </p>

      <button
        type="submit"
        disabled={saving || mediaBusy}
        className="btn btn-candy w-full"
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
