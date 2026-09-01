"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MediaUploader from "./MediaUploader";
import ProductTypePicker from "./ProductTypePicker";
import SizePriceEditor from "./SizePriceEditor";
import type { ProductType } from "@/lib/types";
import { serializeSizeOptions, type SizeOption } from "@/lib/sizes";

interface Category {
  id: string;
  name: string;
}

export interface ProductFormValues {
  id?: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  /** Ordered gallery; the first entry is the main image. */
  images: string[];
  /** Kept so editing a product preserves any video it already has. */
  video: string | null;
  /** Sizes offered for this product, each with its own optional price. */
  sizes: SizeOption[];
  stock: number;
  categoryId: string;
  featured: boolean;
  active: boolean;
  tags: string;
  productType: ProductType;
  /** Free text describing the type — only used when productType is OTHER. */
  customType: string;
}

export default function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: ProductFormValues;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [values, setValues] = useState<ProductFormValues>(
    initial ?? {
      name: "",
      description: "",
      price: 0,
      salePrice: null,
      images: [],
      video: null,
      sizes: [],
      stock: 0,
      categoryId: categories[0]?.id ?? "",
      featured: false,
      active: true,
      tags: "",
      productType: "THREE_PIECE",
      customType: "",
    }
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function set<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!values.name || !values.description || !values.categoryId) {
      setError("Please fill in name, description and category.");
      return;
    }
    if (values.images.length === 0) {
      setError("Please add at least one picture.");
      return;
    }
    if (values.price <= 0) {
      setError("Price must be greater than 0.");
      return;
    }
    if (values.productType === "OTHER" && !values.customType.trim()) {
      setError("Please type what kind of item this is.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: values.name,
        description: values.description,
        price: Number(values.price),
        salePrice: values.salePrice ? Number(values.salePrice) : null,
        images: values.images,
        video: values.video,
        size: serializeSizeOptions(values.sizes),
        stock: Number(values.stock),
        categoryId: values.categoryId,
        featured: values.featured,
        active: values.active,
        tags: values.tags || undefined,
        productType: values.productType,
        customType:
          values.productType === "OTHER" ? values.customType.trim() : null,
      };

      const url = isEdit
        ? `/api/admin/products/${initial!.id}`
        : "/api/admin/products";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      className="grid gap-6 lg:grid-cols-3"
    >
      <div className="space-y-4 lg:col-span-2">
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-card sm:p-6">
          <Text
            label="Product name *"
            value={values.name}
            onChange={(v) => set("name", v)}
          />
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-semibold text-brand-dark">
              Description *
            </label>
            <textarea
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-brand-purple"
            />
          </div>
          <div className="mt-4">
            <Text
              label="Tags (comma separated, for search/SEO)"
              value={values.tags}
              onChange={(v) => set("tags", v)}
              placeholder="lawn, embroidered, summer"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-card sm:p-6">
          <h3 className="mb-4 font-display font-bold text-brand-dark">Pricing & stock</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Num
              label="Price (PKR) *"
              value={values.price}
              onChange={(v) => set("price", v)}
            />
            <Num
              label="Sale price (optional)"
              value={values.salePrice ?? 0}
              onChange={(v) => set("salePrice", v || null)}
            />
            <Num
              label="Stock"
              value={values.stock}
              onChange={(v) => set("stock", v)}
            />
          </div>
          <div className="mt-4">
            <SizePriceEditor
              value={values.sizes}
              onChange={(v) => set("sizes", v)}
              basePrice={values.price}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-card sm:p-6">
          <label className="mb-1.5 block text-sm font-semibold text-brand-dark">
            Category *
          </label>
          <select
            value={values.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-brand-purple"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="mt-4">
            <ProductTypePicker
              value={values.productType}
              onChange={(v) => set("productType", v)}
              customType={values.customType}
              onCustomTypeChange={(v) => set("customType", v)}
            />
          </div>

          <div className="mt-4 space-y-3">
            <Toggle
              label="Featured (show on homepage)"
              checked={values.featured}
              onChange={(v) => set("featured", v)}
            />
            <Toggle
              label="Active (visible in store)"
              checked={values.active}
              onChange={(v) => set("active", v)}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-card sm:p-6">
          <h3 className="mb-4 font-display font-bold text-brand-dark">
            Pictures
          </h3>
          <MediaUploader
            images={values.images}
            onImagesChange={(v) => set("images", v)}
            onUploadingChange={setUploading}
            onError={setError}
            allowUrl
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full rounded-full bg-brand-gradient px-6 py-3.5 font-bold text-brand-dark shadow-brand disabled:opacity-60"
        >
          {uploading
            ? "Uploading media..."
            : saving
            ? "Saving..."
            : isEdit
            ? "Update product"
            : "Create product"}
        </button>
      </div>
    </form>
  );
}

function Text({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-brand-dark">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-brand-purple"
      />
    </div>
  );
}

function Num({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-brand-dark">
        {label}
      </label>
      <input
        type="number"
        min={0}
        value={value === 0 ? "" : value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-brand-purple"
      />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-brand-dark">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded accent-brand-purple"
      />
      {label}
    </label>
  );
}
