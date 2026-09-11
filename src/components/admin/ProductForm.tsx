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

interface Category {
  id: string;
  name: string;
}

interface ProductFormValues {
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
  /**
   * One picture per other colour this design comes in; empty means the design
   * is sold in one colour.
   */
  colors: string[];
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
      colors: [],
      stock: 0,
      categoryId: categories[0]?.id ?? "",
      featured: false,
      active: true,
      tags: "",
      productType: "THREE_PIECE",
      customType: "",
    },
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [colorUploading, setColorUploading] = useState(false);
  // Either uploader still working means the payload would miss a picture.
  const mediaBusy = uploading || colorUploading;

  function set<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
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
        colors: serializeColorImages(values.colors),
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
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <section className="card p-5 sm:p-7">
          <SectionLabel>Details</SectionLabel>
          <Text
            label="Product name *"
            value={values.name}
            onChange={(v) => set("name", v)}
          />
          <div className="mt-5">
            <label className="field-label">Description *</label>
            <textarea
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
              rows={5}
              className="field"
            />
          </div>
          <div className="mt-5">
            <Text
              label="Tags (comma separated, for search/SEO)"
              value={values.tags}
              onChange={(v) => set("tags", v)}
              placeholder="lawn, embroidered, summer"
            />
          </div>
        </section>

        <section className="card p-5 sm:p-7">
          <SectionLabel>Pricing &amp; stock</SectionLabel>
          <div className="grid gap-5 sm:grid-cols-3">
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
          <div className="mt-6">
            <SizePriceEditor
              value={values.sizes}
              onChange={(v) => set("sizes", v)}
              basePrice={values.price}
            />
          </div>
        </section>

        <section className="card p-5 sm:p-7">
          <SectionLabel>Colours</SectionLabel>
          <ColorPicturesField
            images={values.colors}
            onChange={(v) => set("colors", v)}
            onUploadingChange={setColorUploading}
            onError={setError}
          />
        </section>
      </div>

      <div className="space-y-6">
        <section className="card p-5 sm:p-7">
          <SectionLabel>Placement</SectionLabel>
          <label className="field-label">Category *</label>
          <select
            value={values.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            className="field"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="mt-5">
            <ProductTypePicker
              value={values.productType}
              onChange={(v) => set("productType", v)}
              customType={values.customType}
              onCustomTypeChange={(v) => set("customType", v)}
            />
          </div>

          <div className="mt-6 space-y-3 border-t border-brand-ink/10 pt-5">
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
        </section>

        <section className="card p-5 sm:p-7">
          <SectionLabel>Pictures</SectionLabel>
          <MediaUploader
            images={values.images}
            onImagesChange={(v) => set("images", v)}
            onUploadingChange={setUploading}
            onError={setError}
            allowUrl
          />
        </section>

        {error && (
          <p className="border border-brand-logoRed/25 bg-brand-logoRed/[0.04] p-4 text-sm text-brand-ink">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving || mediaBusy}
          className="btn btn-candy w-full"
        >
          {mediaBusy
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

/** The small-caps rule that opens each panel of the form. */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h3 className="eyebrow">{children}</h3>
      <div className="rule-hairline mb-5 mt-3" aria-hidden="true" />
    </>
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
      <label className="field-label">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field"
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
      <label className="field-label">{label}</label>
      <input
        type="number"
        min={0}
        value={value === 0 ? "" : value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="field"
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
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-brand-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded-sm accent-brand-pink"
      />
      {label}
    </label>
  );
}
