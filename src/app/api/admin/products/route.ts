import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatPrice, serializeGallery, slugify } from "@/lib/utils";
import { parseSizeOptions } from "@/lib/sizes";
import { MAX_IMAGES } from "@/lib/media";
import {
  DEFAULT_STICKER_TYPE,
  isStickerProduct,
  STICKER_TYPES,
  stickerTypeLabel,
  stickerTypeOption,
} from "@/lib/types";

// Only name, price and at least one picture are truly required. The rest can be
// omitted and will be auto-filled (see below) — this keeps the "Add product"
// form to just name / type / price / size / pictures, without breaking the
// full-form (edit) payload.
//
// Pictures accept either shape: a single `image`, or an ordered `images` array
// whose first entry becomes the main image.
const productSchema = z
  .object({
    name: z.string().min(2),
    description: z.string().min(5).optional(),
    price: z.number().positive(),
    salePrice: z.number().positive().nullable().optional(),
    image: z.string().min(1).optional(),
    images: z.array(z.string().min(1)).max(MAX_IMAGES).optional(),
    video: z.string().min(1).nullable().optional(),
    // Sizes and their per-size prices, packed into one string by
    // serializeSizeOptions(), e.g. "10x10 cm=250 | 12x20 cm=400".
    size: z.string().max(1000).nullable().optional(),
    stock: z.number().int().min(0).optional(),
    categoryId: z.string().min(1).optional(),
    featured: z.boolean().optional(),
    active: z.boolean().optional(),
    tags: z.string().optional(),
    stickerType: z.enum(STICKER_TYPES).optional(),
    customType: z.string().max(40).nullable().optional(),
  })
  .refine((v) => Boolean(v.image) || (v.images?.length ?? 0) > 0, {
    message: "At least one picture is required",
    path: ["image"],
  });

const DEFAULT_STOCK = 100;

/**
 * Build a reasonable description when the admin didn't type one. Only the fixed
 * sticker types get sticker copy — "Other" may be an engine spray, a tyre or
 * any other accessory, so it gets a neutral description instead.
 */
function autoDescription(
  name: string,
  size?: string | null,
  typeLabel?: string,
  isSticker = true
): string {
  const sizes = parseSizeOptions(size);
  const sizeList = sizes
    .map((s) => (s.price === null ? s.label : `${s.label} (${formatPrice(s.price)})`))
    .join(", ");
  const sizePart =
    sizes.length === 0
      ? ""
      : ` ${sizes.length > 1 ? "Available sizes" : "Size"}: ${sizeList}.`;
  const typePart = typeLabel ? ` ${typeLabel}.` : "";
  if (!isSticker) {
    return `${name} — premium quality product.${typePart} Genuine, durable and built to last.${sizePart}`;
  }
  return `${name} — premium quality vinyl sticker.${typePart} Weather-resistant, easy to apply and long-lasting.${sizePart}`;
}

/** Derive comma-separated tags from the product name and product type. */
function autoTags(name: string, typeLabel?: string): string {
  return Array.from(
    new Set(
      `${name} ${typeLabel ?? ""}`
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2)
    )
  ).join(",");
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = slugify(base);
  let n = 1;
  // Append -n until unique.
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${slugify(base)}-${n++}`;
  }
  return slug;
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid data" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // `images` wins when both shapes are sent; `image` keeps older callers working.
  const gallery = serializeGallery(
    data.images ?? (data.image ? [data.image] : [])
  );
  if (!gallery) {
    return NextResponse.json(
      { error: "At least one picture is required" },
      { status: 400 }
    );
  }

  const stickerType = data.stickerType ?? DEFAULT_STICKER_TYPE;
  // `customType` is only meaningful for OTHER — drop it otherwise so the two
  // fields can never disagree.
  const customType =
    stickerType === "OTHER" ? data.customType?.trim() || null : null;
  const typeLabel = stickerTypeLabel(stickerType, customType);

  // Auto-assign a category when none is provided (simplified add flow): prefer
  // the category matching the sticker type, then fall back to any category.
  let categoryId = data.categoryId;
  if (!categoryId) {
    const preferredSlug = stickerTypeOption(stickerType).categorySlug;
    const category =
      (await prisma.category.findUnique({
        where: { slug: preferredSlug },
        select: { id: true },
      })) ??
      (await prisma.category.findFirst({
        orderBy: { name: "asc" },
        select: { id: true },
      }));
    if (!category) {
      return NextResponse.json(
        { error: "No category exists yet. Create a category first." },
        { status: 400 }
      );
    }
    categoryId = category.id;
  }

  const slug = await uniqueSlug(data.name);

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      description:
        data.description ??
        autoDescription(
          data.name,
          data.size,
          typeLabel,
          isStickerProduct(stickerType)
        ),
      price: data.price,
      salePrice: data.salePrice ?? null,
      image: gallery.image,
      images: gallery.images,
      video: data.video ?? null,
      size: data.size ?? null,
      stock: data.stock ?? DEFAULT_STOCK,
      categoryId,
      featured: data.featured ?? false,
      active: data.active ?? true,
      tags: data.tags ?? autoTags(data.name, typeLabel),
      stickerType,
      customType,
    },
  });

  return NextResponse.json({ id: product.id }, { status: 201 });
}
